# Docus Dutch Locale Patch

This repository applies a temporary Dutch locale fix through a real pnpm patch:

- `patches/docus@5.9.0.patch`
- `pnpm-workspace.yaml` -> `patchedDependencies.docus@5.9.0`

## Why This Patch Exists

Current Docus Dutch translations are incomplete/outdated for assistant UI labels. Until upstream is
merged and released, this patch keeps Dutch production labels correct.

## Why Runtime Override Is Not Used

An app plugin override that calls `nuxtApp.provide('localeMessages', ...)` can fail with:

- `Cannot redefine property: $localeMessages`

Docus already provides `$localeMessages` internally, so redefining it at runtime is unsafe. The pnpm
patch approach avoids that failure and keeps behavior deterministic.

## Scope

- Active when Docus version `5.9.0` is installed.
- Patches `docus/i18n/locales/nl.json` at install time.
- No runtime monkey-patching.

## How To Update The Patch

1. Run `pnpm patch docus@5.9.0`.
2. Edit `i18n/locales/nl.json` in the temporary patch directory.
3. Run `pnpm patch-commit <temp-dir>`.
4. Commit changes to:
   - `patches/docus@5.9.0.patch`
   - `pnpm-workspace.yaml`
   - `pnpm-lock.yaml`

## Removal Criteria

Remove this patch when either upstream PR is merged and included in the pinned Docus version:

- https://github.com/nuxt-content/docus/pull/1335
- https://github.com/nuxt-content/docus/pull/1336

## Removal Steps

1. Upgrade Docus to a version that includes one of the merged PRs.
2. Remove `patchedDependencies.docus@5.9.0` from `pnpm-workspace.yaml`.
3. Delete `patches/docus@5.9.0.patch`.
4. Run `pnpm install` to refresh lockfile.
5. Verify Dutch assistant/documentation labels in UI.
6. Remove references to this temporary patch from:
   - `docs/config/README.md`
   - `.agents/context/runtime-and-deployment.md`
   - `.agents/context/i18n-patches.md`
