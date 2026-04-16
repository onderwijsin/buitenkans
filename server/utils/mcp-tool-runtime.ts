/**
 * File overview:
 * - Shared runtime guards for custom MCP tools.
 * - Adds fail-fast timeouts so stalled collection reads cannot block assistant responses.
 * - Provides fallback resolution helpers to keep tool output contracts stable.
 */
const DEFAULT_TIMEOUT_MS = 4_000
const SOURCE_COOLDOWN_MS = 30_000
const sourceCooldownUntilByLabel = new Map<string, number>()

class TimeoutError extends Error {
	constructor(label: string, timeoutMs: number) {
		super(`Timed out after ${timeoutMs}ms while executing ${label}`)
		this.name = 'TimeoutError'
	}
}

const createTimeoutError = (label: string, timeoutMs: number) => new TimeoutError(label, timeoutMs)

const isTimeoutError = (error: unknown): error is TimeoutError => error instanceof TimeoutError

const isInCooldown = (label: string) => {
	const cooldownUntil = sourceCooldownUntilByLabel.get(label)
	if (!cooldownUntil) {
		return false
	}

	if (cooldownUntil <= Date.now()) {
		sourceCooldownUntilByLabel.delete(label)
		return false
	}

	return true
}

const activateCooldown = (label: string) => {
	sourceCooldownUntilByLabel.set(label, Date.now() + SOURCE_COOLDOWN_MS)
}

/**
 * Rejects if the operation exceeds the configured timeout.
 *
 * @param operationFactory Factory that starts the async operation.
 * @param label Human-readable operation label used in timeout errors.
 * @param timeoutMs Timeout in milliseconds.
 * @returns The resolved operation value.
 */
export async function withTimeout<T>(
	operationFactory: (_signal: AbortSignal) => Promise<T>,
	label: string,
	timeoutMs = DEFAULT_TIMEOUT_MS
) {
	const controller = new AbortController()
	let timeoutId: ReturnType<typeof setTimeout> | undefined

	try {
		const operation = operationFactory(controller.signal)

		return await Promise.race([
			operation,
			new Promise<T>((_resolve, reject) => {
				timeoutId = setTimeout(() => {
					controller.abort(createTimeoutError(label, timeoutMs))
					reject(createTimeoutError(label, timeoutMs))
				}, timeoutMs)
			})
		])
	} finally {
		controller.abort()
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
	}
}

/**
 * Resolves an operation with timeout protection and returns a fallback on failure.
 *
 * @param operationFactory Factory that starts the async operation.
 * @param label Human-readable operation label used in timeout errors.
 * @param fallback Fallback value returned on timeout/error.
 * @param timeoutMs Timeout in milliseconds.
 * @returns Resolved operation value or fallback.
 */
export async function resolveWithFallback<T>(
	operationFactory: (_signal: AbortSignal) => Promise<T>,
	label: string,
	fallback: T,
	timeoutMs = DEFAULT_TIMEOUT_MS
) {
	if (isInCooldown(label)) {
		return fallback
	}

	try {
		return await withTimeout(operationFactory, label, timeoutMs)
	} catch (error) {
		if (isTimeoutError(error)) {
			activateCooldown(label)
		}

		return fallback
	}
}
