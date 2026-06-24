# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root.
- **`docs/adr/`** for architectural decisions relevant to the current area.
- If `CONTEXT-MAP.md` appears in the future, treat the repo as multi-context and follow it to per-context `CONTEXT.md` files.

If any of these files don't exist, proceed silently. Don't flag their absence and don't suggest creating them upfront.

## File structure (configured now)

Single-context repo:

/
- `CONTEXT.md`
- `docs/adr/`
- `src/`

## Use the glossary's vocabulary

When naming domain concepts (issues, refactors, tests), use terms from `CONTEXT.md` and avoid drifting to synonyms the glossary rejects.

## Flag ADR conflicts

If proposed work contradicts an ADR, surface it explicitly instead of silently overriding.
