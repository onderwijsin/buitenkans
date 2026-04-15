# i18n Patches (Agent)

## Temporary Docus NL Locale Patch

Active temporary patch:

- `patches/docus@5.9.0.patch`
- `pnpm-workspace.yaml` -> `patchedDependencies.docus@5.9.0`

Purpose:

- Override incomplete/outdated Dutch Docus locale strings, especially assistant labels.
- Avoid runtime `$localeMessages` redefinition errors.

Removal trigger:

- Remove patch after either upstream PR is merged and released in the pinned Docus version:
  - https://github.com/nuxt-content/docus/pull/1335
  - https://github.com/nuxt-content/docus/pull/1336

Human mirror:

- `docs/config/docus-nl-locale-patch.md`
