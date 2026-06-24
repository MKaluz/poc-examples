# crud-product

A self-contained full-stack POC demonstrating Product CRUD via a [Compose Stack](../CONTEXT.md#compose-stack).

## Stack

| Service  | Technology                         | Local port |
|----------|------------------------------------|-----------|
| **db**   | PostgreSQL 16                      | 5432      |
| **api**  | .NET 8 Minimal API + EF Core       | 5000      |
| **frontend** | React 18 + Vite + Tailwind CSS | 3000      |

## Quick start

```bash
cd crud-product
docker compose up --build
```

> **Credentials**: The compose stack uses `${POSTGRES_PASSWORD:-postgres}` — works out of the box.
> To override, copy `.env.example` to `.env` and set your own values before running `docker compose up`.


- Frontend: <http://localhost:3000>
- API (Swagger UI): <http://localhost:5000/swagger>

The API applies EF Core migrations automatically on startup — no manual database setup is required.

## Smoke test

After the stack is running, verify all services from another terminal:

```bash
./smoke-test/run.sh
```

## Local development (without Docker)

### API

```bash
cd api
# Set the connection string (or use dotnet user-secrets)
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=crudproduct;Username=postgres;Pwd=postgres"
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # proxies /api to http://localhost:5000 via Vite dev server
```

## Regenerating the TypeScript client

The frontend ships a hand-written API client (`src/api/products.ts`) that mirrors the OpenAPI contract. To regenerate it from a live API using [orval](https://orval.dev):

1. Start the API (via Docker or locally).
2. Download the latest spec:
   ```bash
   curl http://localhost:5000/swagger/v1/swagger.json -o frontend/openapi/swagger.json
   ```
3. Run orval:
   ```bash
   cd frontend && npm run generate
   ```

Generated files are placed in `frontend/src/api/generated/` and can replace the hand-written client.

## Project layout

```
crud-product/
├── docker-compose.yml        # Compose Stack — starts all services
├── api/                      # .NET 8 Minimal API
│   ├── Program.cs            # Endpoints, startup migration, validation
│   ├── Models/Product.cs     # Domain entity + request DTO
│   ├── Data/AppDbContext.cs  # EF Core context
│   └── Migrations/           # EF Core migration history
├── frontend/                 # React + TypeScript SPA
│   ├── src/api/products.ts   # Typed API client (axios)
│   ├── src/components/       # ProductsPage, ProductForm, DeleteConfirm
│   ├── orval.config.ts       # orval code-generation config
│   ├── openapi/swagger.json  # OpenAPI spec (update with curl command above)
│   └── nginx.conf            # nginx: serves SPA + proxies /api → api service
└── smoke-test/run.sh         # End-to-end reachability + CRUD smoke test
```
