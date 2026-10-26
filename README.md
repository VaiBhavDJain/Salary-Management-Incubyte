# Salary Management

A web app for ACME's HR manager to maintain salary records for 10,000 employees across 8 countries, and to answer "how do we pay people?" without spreadsheets.

**Live demo:** https://salary-management-kwlr.onrender.com

It runs on Render's free tier, which sleeps when idle, so the first request after a pause can take up to a minute.

## Demo video

[![Watch the 3-minute demo](docs/screenshots/demo-poster.png)](docs/demo.mp4)

[Watch the demo (MP4, 3 min)](docs/demo.mp4). It walks through:

1. Searching, filtering and sorting 10,000 employees.
2. Adding, editing and deleting an employee, with form and API validation.
3. Exploring pay insights per country and per job title.

## Screenshots

| Employees | Pay overview |
|---|---|
| ![Employee list filtered to India, sorted by salary](docs/screenshots/employees.png) | ![Pay per country in local currency](docs/screenshots/pay-overview.png) |
| **Country insights** | **Add employee** |
| ![Pay by job title in India](docs/screenshots/country-insights.png) | ![Form with currency-aware salary field](docs/screenshots/employee-form.png) |

## What it does

- **Employee directory.** Server-side pagination over 10k rows, plus:
  - Debounced search by name or email.
  - Filters for country, department and job title.
  - Sorting by name or salary.
  - Page size 25, 50 or 100.

  Every view lives in the URL, so links, refreshes and the back button restore it.
- **Salary records.** Add, edit and delete employees.
  - Validation runs in the form and in the API. API errors appear next to the field they belong to.
  - Job title and department suggest existing values, which keeps the groupings in insights clean.
- **Pay insights.**
  - Per country: headcount and median, average, lowest and highest salary, in local currency, plus the highest paid role.
  - A sortable breakdown by job title, where each role links to the matching employees.
  - An org overview with headcount by department.
- **Demo data.** A deterministic seed of 10,000 employees. Each has a unique name from Faker's locale for their country, plus a realistic role and a pay band for that country.

Scope, decisions and deliberate omissions (for example, no cross-currency comparison and no authentication in v1) are in [docs/requirements.md](docs/requirements.md).

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Ruby 3.3, Rails 8.1 (API mode), PostgreSQL 16 |
| Frontend | React 19, TypeScript, Vite, Ant Design 6, TanStack Query, React Router 7 |
| Tests | RSpec, FactoryBot, shoulda-matchers; Vitest, React Testing Library, MSW |
| Quality | RuboCop, Brakeman, bundler-audit, oxlint, `tsc`, GitHub Actions (tests, lint, security scans, Docker build) |
| Delivery | One Docker image: Rails serves the API and the built React app |

## Run it locally

Requirements: Ruby 3.3.5, Node 22 and PostgreSQL 16.

```bash
# API on http://localhost:3000
cd backend
bundle install
bin/rails db:prepare      # creates the databases, loads the schema and seeds 10k employees
bin/rails server

# UI on http://localhost:5173 (proxies /api to Rails)
cd frontend
npm ci
npm run dev
```

`bin/rails db:seed:replant` resets the demo data.

## Tests and checks

```bash
cd backend && bundle exec rspec && bin/rubocop && bin/brakeman --no-pager
cd frontend && npm test && npm run typecheck && npm run lint
```

- **Backend:** 79 specs run in under a second.
- **Frontend:** 37 tests run in about 11 seconds. They render real pages against a mocked HTTP layer (MSW), so they exercise routing, data fetching and forms together.
- **CI:** runs everything above on every push and builds the production Docker image.

## Production

One image serves both the API and the UI:

```bash
docker build -t salary-management .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://user:pass@host/db \
  -e SECRET_KEY_BASE=$(openssl rand -hex 64) \
  -e SEED_DEMO_DATA=true \
  salary-management
```

- On boot, the container prepares the database. `SEED_DEMO_DATA=true` loads the 10k demo employees, but only into an empty table.
- `index.html` is never cached. Hashed JS and CSS are pre-gzipped and cached for a year.
- CI builds this image, runs it against PostgreSQL, and smoke-tests it:
  - the health check;
  - a deep link returning the app;
  - 10,000 seeded employees in the API;
  - gzipped assets.

### Deploy on Render

`render.yaml` describes a web service built from the Dockerfile and a PostgreSQL database. To deploy:

1. In Render, choose **New → Blueprint** and select this repository.
2. Render generates `SECRET_KEY_BASE`, wires up `DATABASE_URL`, and seeds the demo data on first boot.

Free-tier limits to know about:

- The service sleeps when idle, so the first request after a pause takes up to a minute.
- Render's free PostgreSQL expires after 30 days. For a longer-lived demo, point `DATABASE_URL` at another provider, such as Neon.

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/api/employees` | `q`, `country_code`, `department`, `job_title`, `sort` (`full_name`, `salary`), `direction` (`asc`, `desc`), `page`, `per_page` (max 100) |
| GET | `/api/employees/:id` | Returns 404 as JSON if missing |
| POST | `/api/employees` | Body `{ "employee": { ... } }`. Returns 201, or 422 with `{ "errors": { "field": ["message"] } }` |
| PATCH | `/api/employees/:id` | Accepts partial updates |
| DELETE | `/api/employees/:id` | Returns 204 |
| GET | `/api/filter_options` | Supported countries, plus the departments and job titles in use |
| GET | `/api/insights/overview` | Headcount, pay per country, headcount per department |
| GET | `/api/insights/countries/:code` | Summary and job title breakdown for one country |

## Project structure

```
backend/
  app/models/            Employee (validations, normalisation), Country (supported countries)
  app/queries/           EmployeeQuery: search, filters and whitelisted sorting
  app/services/          PayInsights (one SQL query per breakdown), OrgOverview, Pagination
  app/serializers/       Public JSON shape of an employee
  app/controllers/       Thin API controllers, plus FrontendController for the React app
  lib/seeds/             Deterministic 10k employee seeder (unique Faker names per country)
frontend/src/
  features/employees/    List, URL-driven filters, table, form modal, mutations
  features/insights/     Overview and country pages
  api/  lib/  layout/    Fetch client, formatting helpers, shared layout
docs/                    Requirements, architecture, performance, demo video
```

## How it was built

Each behaviour was built test-first. The commit history shows the loop: a failing test (`test:`), the code that passes it (`feat:`), and a refactor when one was worth making. Every API change was also exercised with `curl` against a running server, and every UI change in a real browser with screenshots, on both the development and production builds.

More detail:

- [Architecture and trade-offs](docs/architecture.md)
- [Performance measurements](docs/performance.md)
