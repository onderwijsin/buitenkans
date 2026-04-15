/**
 * ⚠️ WHY THIS ROUTE IS DUPLICATED / CUSTOMIZED
 *
 * This route is a modified version of the default Docus assistant endpoint.
 *
 * We intentionally override the upstream implementation because the default
 * MCP HTTP transport from `@ai-sdk/mcp` is NOT compatible with our runtime:
 *
 *   - Runtime: Cloudflare Workers (via Nitro)
 *   - Transport: MCP over HTTP using SSE (text/event-stream)
 *
 * ---
 *
 * 🚨 ROOT PROBLEM
 *
 * The upstream MCP client fails in this environment due to a combination of:
 *
 * 1. Missing Accept headers
 *    The MCP server requires:
 *      Accept: application/json, text/event-stream
 *
 *    The default client does not send this correctly → server returns 406.
 *
 * 2. Broken SSE handling in edge runtime
 *    After the 406 (or during SSE negotiation), the MCP transport attempts to
 *    recover and handle the stream. In Cloudflare Workers this leads to:
 *
 *      TypeError: Illegal invocation
 *
 *    This is caused by unbound runtime APIs (e.g. `fetch`, streams) where `this`
 *    context is lost. Workers is strict about this; Node is not.
 *
 * 3. Misleading production errors
 *    The above failure cascades into:
 *      - HTTP 500 (locally)
 *      - HTTP 522 (via Cloudflare)
 *
 *    These are transport-level artifacts, NOT real network timeouts.
 *
 * ---
 *
 * ✅ WHAT WE FIX HERE
 *
 * We patch the MCP transport by:
 *
 * - Forcing correct Accept headers for SSE:
 *     application/json, text/event-stream
 *
 * - Binding `fetch` to `globalThis` to avoid Illegal invocation:
 *     fetch.bind(globalThis)
 *
 * This makes the MCP client compatible with Cloudflare Workers.
 *
 * ---
 *
 * 🤔 WHY NOT JUST USE MCP NORMALLY?
 *
 * In this project, the MCP server is deployed in the SAME app.
 *
 * That means the default architecture is:
 *
 *   assistant route → HTTP → MCP route → tools
 *
 * This adds:
 * - unnecessary network overhead
 * - extra failure surface (this bug)
 * - runtime incompatibilities (Workers + SSE)
 *
 * Long-term, the cleaner solution is to bypass HTTP entirely and call tools
 * directly in-process.
 *
 * ---
 *
 * 📌 TL;DR
 *
 * This override exists because:
 *   "MCP HTTP transport + SSE + Cloudflare Workers = broken by default"
 *
 * If you remove this patch, expect:
 *   - 406 errors
 *   - Illegal invocation crashes
 *   - random 522s in production
 *
 */

import type { ToolCallPart, ToolSet, UIMessageStreamWriter } from 'ai'

import { createMCPClient } from '@ai-sdk/mcp'
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	streamText
} from 'ai'

const MAX_STEPS = 10

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stopWhenResponseComplete({ steps }: { steps: any[] }): boolean {
	const lastStep = steps.at(-1)
	if (!lastStep) return false

	// Primary condition: stop when model gives a text response without tool calls
	const hasText = Boolean(lastStep.text && lastStep.text.trim().length > 0)
	const hasNoToolCalls = !lastStep.toolCalls || lastStep.toolCalls.length === 0

	if (hasText && hasNoToolCalls) return true

	return steps.length >= MAX_STEPS
}

function getSystemPrompt(siteName: string) {
	return `You are the documentation assistant for ${siteName}. Help users navigate and understand the project documentation.

**Your identity:**
- You are an assistant helping users with ${siteName} documentation
- NEVER use first person ("I", "me", "my") - always refer to the project by name: "${siteName} provides...", "${siteName} supports...", "The project offers..."
- Be confident and knowledgeable about the project
- Speak as a helpful guide, not as the documentation itself

**Tool usage (CRITICAL):**
- You have tools: list-pages (discover pages) and get-page (read a page)
- If a page title clearly matches the question, read it directly without listing first
- ALWAYS respond with text after using tools - never end with just tool calls

**Guidelines:**
- If you can't find something, say "There is no documentation on that yet" or "${siteName} doesn't cover that topic yet"
- Be concise, helpful, and direct
- Guide users like a friendly expert would

**Links and exploration:**
- Tool results include a \`url\` for each page — prefer markdown links \`[label](url)\` so users can open the doc in one click
- When it helps, add extra links (related pages, “read more”, side topics) — make the answer easy to dig into, not a wall of text
- Stick to URLs from tool results (\`url\` / \`path\`) so links stay valid

**FORMATTING RULES (CRITICAL):**
- NEVER use markdown headings (#, ##, ###, etc.)
- Use **bold text** for emphasis and section labels
- Start responses with content directly, never with a heading
- Use bullet points for lists
- Keep code examples focused and minimal

**Response style:**
- Conversational but professional
- "Here's how you can do that:" instead of "The documentation shows:"
- "${siteName} supports TypeScript out of the box" instead of "I support TypeScript"
- Provide actionable guidance, not just information dumps`
}

/**
 * Create a Cloudflare-safe fetch wrapper.
 * - Forces correct Accept header for SSE
 * - Ensures correct `this` binding
 */
function createSafeFetch(): typeof fetch {
	const boundFetch = fetch.bind(globalThis)

	return (input, init) => {
		const headers = new Headers(init?.headers)

		// Critical: required by MCP SSE servers
		headers.set('accept', 'application/json, text/event-stream')

		return boundFetch(input, {
			...init,
			headers
		})
	}
}

export default defineEventHandler(async (event) => {
	const { messages } = await readBody(event)
	const config = useRuntimeConfig()
	const siteConfig = getSiteConfig(event)

	const siteName = siteConfig.name || 'Documentation'

	const mcpServer = config.assistant.mcpServer
	const isExternalUrl = mcpServer.startsWith('http://') || mcpServer.startsWith('https://')
	const baseURL = config.app?.baseURL?.replace(/\/$/, '') || ''
	const mcpUrl = isExternalUrl
		? mcpServer
		: import.meta.dev
			? `http://localhost:3000${baseURL}${mcpServer}`
			: `${getRequestURL(event).origin}${baseURL}${mcpServer}`

	const httpClient = await createMCPClient({
		transport: { type: 'http', url: mcpUrl, fetch: createSafeFetch() }
	})
	const mcpTools = await httpClient.tools()

	const stream = createUIMessageStream({
		execute: async ({ writer }: { writer: UIMessageStreamWriter }) => {
			const modelMessages = await convertToModelMessages(messages)
			const result = streamText({
				model: config.assistant.model,
				maxOutputTokens: 4000,
				maxRetries: 2,
				stopWhen: stopWhenResponseComplete,
				system: getSystemPrompt(siteName),
				messages: modelMessages,
				tools: mcpTools as ToolSet,
				onStepFinish: ({ toolCalls }: { toolCalls: ToolCallPart[] }) => {
					if (toolCalls.length === 0) return
					writer.write({
						id: toolCalls[0]?.toolCallId,
						type: 'data-tool-calls',
						data: {
							tools: toolCalls.map((tc: ToolCallPart) => {
								const args = 'args' in tc ? tc.args : 'input' in tc ? tc.input : {}
								return {
									toolName: tc.toolName,
									toolCallId: tc.toolCallId,
									args
								}
							})
						}
					})
				}
			})
			writer.merge(result.toUIMessageStream())
		},
		onFinish: async () => {
			await httpClient.close()
		}
	})

	return createUIMessageStreamResponse({ stream })
})
