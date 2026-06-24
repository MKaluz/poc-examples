# POC Examples — Glossary

## Terms

**POC (Proof of Concept)**
A self-contained, copy-paste-ready starter template demonstrating one full-stack pattern. Each POC is independently runnable via `docker compose up`.

**Full-Stack**
The combination of a .NET (C#) backend API and a React (TypeScript) frontend. The two sides are connected via a generated OpenAPI contract.

**Product**
The domain entity used in the CRUD POC. Has at minimum: id, name, price, category, stock count. Represents a realistic but simple business object.

**API Contract**
The OpenAPI specification emitted by the .NET API at runtime. This is the single source of truth for the shape of all requests and responses. The React side never drifts from it because the TypeScript client is generated from it.

**Generated TypeScript Client**
TypeScript code auto-generated from the OpenAPI spec by `orval`. Produces typed TanStack Query hooks (e.g. `useGetProducts()`) that the React app consumes directly. No hand-written `fetch` calls.

**Compose Stack**
A `docker-compose.yml` that spins up all services for a given POC (API, frontend, database) with a single `docker compose up`. Each POC has its own stack.

**POC Folder**
A self-contained directory at the repo root (e.g. `crud-product/`) containing everything needed for one POC: the .NET API, the React frontend, and a `docker-compose.yml`. Nothing is shared between POC folders. Any POC folder can be copied wholesale into a real project.

**Startup Migration**
The pattern where the .NET API automatically applies EF Core migrations against Postgres when it starts up (`Program.cs` calls `MigrateDatabase()`). Ensures `docker compose up` is fully one-command with no manual steps.

**UI Component Strategy**
The React app uses `shadcn/ui` with Tailwind CSS. Components are copied into the codebase (not consumed as opaque package widgets), making them easy to customize while preserving accessibility and good defaults for forms and dialogs.
