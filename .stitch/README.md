# Stitch Design Exchange

This directory is the repo-mediated handoff between Lum, Google Stitch, and implementation.

## Workflow
1. Lum updates `.stitch/REQUEST.md` with one focused UI problem.
2. GitHub Actions runs the official `@google/stitch-sdk` against the current source and `DESIGN.md`.
3. Stitch generates exactly three variants.
4. The workflow saves each variant's HTML and screenshot under `stitch-output/<run-id>/` and opens a design PR.
5. Lum reviews all three, documents the selection, and only then integrates the chosen direction into app code.

## Rules
- Never modify production automatically from a Stitch output.
- Always return 3 variants.
- Use current repository source as context whenever available.
- Preserve the public/private visual boundary defined in `DESIGN.md`.
- Treat Stitch output as a design candidate, not production truth: Lum performs accessibility, responsiveness, code-quality, and product QA.

## One-time setup
The repository needs a GitHub Actions secret named `STITCH_API_KEY`. Obtain the key through the official Google Stitch setup and add it at:

Repository Settings -> Secrets and variables -> Actions -> New repository secret

Name: `STITCH_API_KEY`

Do not commit the key to this repository.
