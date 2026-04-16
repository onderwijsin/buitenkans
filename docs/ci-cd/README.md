# CI/CD

GitHub Actions workflows live in `/.github/workflows`.

## Active Workflows

- `pull_request.yml`
- `code_quality.yml` (reusable)
- `deploy_worker.yml` (reusable)
- `deploy.yml`
- `content_promote.yml`
- `sync_main_to_content.yml`
- `release.yml`
- `lint_pr_title.yml`
- `gitleaks.yml`

## Pull Request Flow

`pull_request.yml`:

1. Runs code quality workflow.
2. Runs preview deployment via `deploy_worker.yml` (version upload flow).
3. Skips these jobs when PR head branch is `content`.

Current repo-state note:

- `code_quality.yml` still defines test/coverage hooks,
- but this project currently has no test scripts in `package.json`.

## Content Editorial Flow

Branch workflow for Studio-managed content:

1. Editors commit to `content` branch.
2. Deploy build forces `GITHUB_REF_NAME=content` so Nuxt Studio does not auto-detect `main` from CI.
3. `content_promote.yml` validates that only `content/**` changed.
4. If valid, it merges `content` into `main` using GitHub App token.
5. `sync_main_to_content.yml` syncs `main` back into `content`.

## Deploy Flow

`deploy.yml` orchestrates deployment:

- automatic production deployment on `main` **only when changes are content-only**
- manual dispatch supports explicit environment selection (`preview` or `production`)
- deploy execution delegated to `deploy_worker.yml`

`deploy_worker.yml`:

- builds Nuxt app
- deploys through Wrangler
- supports preview version upload flow and optional promotion
- writes deployment status back to GitHub

## Release And Policy Checks

- `release.yml`: semantic-release workflow
- `lint_pr_title.yml`: semantic PR title validation
- `gitleaks.yml`: secret scanning

## Required Operational Understanding

- code changes on `main` are not auto-deployed unless manually triggered
- content-only changes on `main` auto-deploy
- Cloudflare runtime bindings must exist in target environment (`DB`, `CACHE`, `BLOB`)
