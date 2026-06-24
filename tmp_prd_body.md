## Problem Statement

The team needs reusable, copy-paste-ready POC examples for common full-stack development in a .NET + React stack, with special focus on integration correctness and practical infrastructure. Existing examples are missing, and ad-hoc prototypes often fail to demonstrate a complete end-to-end path through data model, API contract, frontend behavior, and containerized runtime.

## Solution

Create the first POC Folder, `crud-product`, as a self-contained Compose Stack that demonstrates a complete Product CRUD flow through all layers of a Full-Stack system. The .NET Minimal API exposes an OpenAPI API Contract, React consumes a Generated TypeScript Client from `orval`, and Postgres persistence is managed by EF Core with Startup Migration. The frontend uses `shadcn/ui` + Tailwind with `react-hook-form` and `zod`, including both client-side validation and server validation feedback.

## User Stories

1. As a developer, I want a self-contained POC Folder, so that I can copy it into a real project without untangling shared dependencies.
2. As a developer, I want to run the full system with `docker compose up`, so that local setup is one command.
3. As a developer, I want API, frontend, and database services wired in a Compose Stack, so that I can test integration paths quickly.
4. As a developer, I want the .NET API to use Minimal APIs, so that the HTTP surface is easy to learn and modify.
5. As a developer, I want Product persisted in Postgres via EF Core, so that the POC mirrors common production patterns.
6. As a developer, I want Startup Migration at API boot, so that schema setup is automatic and repeatable.
7. As a developer, I want the API to publish an OpenAPI API Contract, so that client integration is contract-driven.
8. As a frontend developer, I want a Generated TypeScript Client, so that request and response types stay synchronized with backend changes.
9. As a frontend developer, I want generated TanStack Query hooks, so that data fetching, caching, and status handling are consistent.
10. As a user, I want to view a list of Product entries, so that I can verify read-path behavior end-to-end.
11. As a user, I want to create a Product from a form, so that I can verify write-path behavior end-to-end.
12. As a user, I want to edit an existing Product, so that I can correct business data.
13. As a user, I want to delete a Product with explicit confirmation, so that destructive actions are intentional.
14. As a user, I want client-side form validation, so that obvious input mistakes are caught immediately.
15. As a user, I want server-side validation errors rendered in the form, so that I can recover from API rejections.
16. As a developer, I want a consistent validation model across create and update, so that behavior is predictable.
17. As a developer, I want the UI built with the selected UI Component Strategy (`shadcn/ui` + Tailwind), so that forms/dialogs are accessible and customizable.
18. As a developer, I want stable Product field semantics (id, name, price, category, stock count), so that frontend and backend language does not drift.
19. As a developer, I want generated-client regeneration as part of normal workflow, so that API changes are propagated safely.
20. As a maintainer, I want smoke-level verification of container startup and CRUD paths, so that the POC is dependable as a starter.
21. As a maintainer, I want this POC to establish conventions for future POC Folders, so that additional examples can be added consistently.
22. As a developer, I want this POC to remain independently runnable from other POCs, so that breakages are isolated.
23. As a developer, I want clear boundaries between API Contract, Generated TypeScript Client, and UI concerns, so that troubleshooting integration issues is straightforward.
24. As a developer, I want error states surfaced coherently in the UI, so that failures are observable and actionable during demos.
25. As a developer, I want reproducible local behavior across machines, so that onboarding friction is minimal.

## Implementation Decisions

- Build one new POC Folder named `crud-product` as an independently runnable vertical slice.
- Use .NET Minimal APIs for Product CRUD endpoints and OpenAPI emission.
- Use EF Core with Postgres for persistence.
- Apply Startup Migration from API startup path to eliminate manual DB migration steps in POC usage.
- Define Product as the canonical domain entity for this POC with the agreed baseline fields: id, name, price, category, stock count.
- Treat OpenAPI output as the single API Contract source of truth.
- Generate the frontend API layer with `orval` to produce a Generated TypeScript Client and typed TanStack Query hooks.
- Use React + TypeScript for frontend implementation.
- Implement form handling with `react-hook-form` + `zod` for client validation.
- Map server validation failures to frontend form-level and field-level feedback so validation exists on both sides.
- Use UI Component Strategy based on `shadcn/ui` + Tailwind for accessible, customizable CRUD interactions.
- Include a confirmation interaction for Product deletion.
- Keep the POC self-contained and avoid cross-POC shared packages at this stage.
- Adopt this POC’s architecture and vocabulary as a baseline pattern for future POC Folders.

## Testing Decisions

- Good tests should validate external behavior at the highest seam possible and avoid asserting implementation details.
- Primary seam strategy:
  - Seam 1 (highest priority): compose-level behavioral smoke path that verifies services boot, API is reachable, and a full CRUD user path is achievable end-to-end.
  - Seam 2: API behavior tests for Product endpoint contracts, validation outcomes, and persistence effects.
  - Seam 3: frontend behavior tests for form validation, server-error rendering, and CRUD interaction states via generated hooks.
- Prefer existing seams over introducing many new harnesses. If a new seam is needed, create a single high-level seam rather than many low-level seams.
- Prior-art expectation in this repo is currently minimal; establish pragmatic smoke/integration-first coverage that future POCs can reuse conceptually.

## Out of Scope

- Authentication/authorization flows (JWT/cookies, protected routes, role models).
- Real-time updates (e.g., SignalR/websocket patterns).
- File upload/download and object storage integration.
- Multi-POC shared libraries and monorepo package extraction.
- Cloud deployment targets and production hosting hardening.
- Advanced optimization patterns (optimistic updates, complex caching invalidation strategies beyond practical defaults).
- Full enterprise observability stack beyond basic operational visibility needed for POC confidence.

## Further Notes

- This PRD intentionally optimizes for learning velocity and reproducible integration over production completeness.
- The chosen stack demonstrates the integration contract lifecycle clearly: API change -> OpenAPI update -> client regeneration -> typed UI usage.
- This PRD is ready to be decomposed into tracer-bullet implementation issues in dependency order.
