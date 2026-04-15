# Change Workflow (Agent)

1. Read `AGENTS.md` and `.agents/rules/operational-contract.md`.
2. Confirm real runtime behavior from code before changing docs or implementation.
3. Keep scope tight; avoid opportunistic refactors.
4. Update both `docs/` and `.agents/` when active facts change.
5. Run baseline checks:
   - `pnpm lint`
   - `pnpm typecheck`
6. Summarize:
   - what changed
   - what was deprecated or cleaned up
   - any residual risks
