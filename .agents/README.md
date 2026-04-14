# Agent Knowledge Base

Operational knowledge for coding agents in this repository.

## Contract

- `docs/` is for humans.
- `.agents/` is for agents.
- Active information must be maintained in both places.

Human-side companion: `docs/agent-knowledge-sync.md`.

## Structure

- `skills/`: tooling knowledge and skill packs.
- `context/`: domain and system knowledge.
- `patterns/`: implementation style and execution playbooks.
- `rules/`: hard constraints and policy.

## Read Order (Fast)

1. `rules/operational-contract.md`
2. `rules/documentation-sync.md`
3. `skills/README.md`

## Source Mapping

- Human conventions: `docs/conventions.md`
- Human agent playbook: `docs/agent-guide.md`
- Human architecture: `docs/monorepo-setup.md`
- Human testing: `docs/testing.md`

When any mapped source changes, update the relevant `.agents/*` file in the same change.
