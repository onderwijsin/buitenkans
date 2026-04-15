# Agent Guide (For Humans)

This guide helps maintainers work effectively with coding agents in this repository.

Detailed machine-oriented instructions live in [`.agents/`](../../.agents/README.md).

## Ground Rules

- Ask agents to preserve runtime behavior unless a change is explicitly requested.
- Require agents to keep `docs/` and `.agents/` synchronized for active information.
- Require conventional commits and semantic PR titles.
- Do not let agents edit `.agents/skills/**` unless explicitly requested.

## What Agents Should Understand First

- Project architecture and scope: [`../../README.md`](../../README.md)
- Agent contract: [`../../AGENTS.md`](../../AGENTS.md)
- Coding conventions: [`../conventions/README.md`](../conventions/README.md)
- Content/editor workflow: [`../content/README.md`](../content/README.md)
- CI/CD behavior: [`../ci-cd/README.md`](../ci-cd/README.md)

## Current Product Scope

- Docus-based documentation site
- custom homepage and selected custom docs routes
- FAQ and people YAML collections
- Nuxt Studio content workflow
- Sentry + Plausible + Cloudflare deployment
- Docus AI assistant (Mistral model via gateway key)
- Nuxt UI as core UI system, plus one local Inspira-based pattern component

## Review Checklist For Agent PRs

1. Does the change match current runtime features?
2. Are docs updated in both `docs/` and `.agents/`?
3. Are edge/runtime constraints preserved?
4. Are commit/PR titles compliant with conventional format?
