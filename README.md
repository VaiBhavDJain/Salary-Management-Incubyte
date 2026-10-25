# Salary Management

A web app for ACME's HR manager to maintain salary records for ~10,000 employees across 8 countries, and to answer "how do we pay people?" without spreadsheets.

> Status: backend API complete. The React frontend is in progress.

## What it does

- **Employee directory.** A paginated list with search by name or email, filters for country, department and job title, and sorting by name or salary.
- **Salary records.** Create, update and delete employees, with validation errors returned per field.
- **Pay insights.**
  - Per country: headcount and min, max, average and median salary, in local currency.
  - Breakdown by job title within a country.
  - Org overview: headcount by country and by department.
- **Seed data.** 10,000 realistic employees across 8 countries, the same on every run.

The scope, decisions and deliberate omissions are in [docs/requirements.md](docs/requirements.md).

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Ruby 3.3, Rails 8.1 (API mode) |
| Database | PostgreSQL 16 |
| Tests | RSpec, FactoryBot, shoulda-matchers |
| Quality | RuboCop, Brakeman, bundler-audit, GitHub Actions CI |
| Frontend | React + Vite + TypeScript (in progress) |

## Running locally

Requirements: Ruby 3.3.5 and PostgreSQL 16 running locally.

```bash
cd backend
bundle install
bin/rails db:prepare     # creates the databases and loads the schema
bin/rails db:seed        # 10,000 employees; use db:seed:replant to start fresh
bin/rails server         # http://localhost:3000
```

## Running tests

```bash
cd backend
bundle exec rspec        # about 0.5s
bin/rubocop
bin/brakeman --no-pager
```

## API

All endpoints return JSON.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/employees` | Params: `q`, `country_code`, `department`, `job_title`, `sort` (`full_name` or `salary`), `direction` (`asc` or `desc`), `page`, `per_page` (max 100) |
| GET | `/api/employees/:id` | Returns 404 if the employee is missing |
| POST | `/api/employees` | Body `{ "employee": { ... } }`. Returns 201, or 422 with `{ "errors": { field: [messages] } }` |
| PATCH | `/api/employees/:id` | Accepts partial updates. Returns 200 or 422 |
| DELETE | `/api/employees/:id` | Returns 204 |
| GET | `/api/filter_options` | Countries, plus the departments and job titles in use |
| GET | `/api/insights/overview` | Headcount, pay per country, headcount per department |
| GET | `/api/insights/countries/:code` | Summary and job title breakdown for one country |

Example:

```bash
curl "localhost:3000/api/employees?country_code=IN&department=Engineering&sort=salary&direction=desc&per_page=5"
curl "localhost:3000/api/insights/countries/IN"
```

## Project structure

```
backend/
  app/models/          Employee (validations, normalisation), Country (supported countries)
  app/queries/         EmployeeQuery: search, filters and sorting for the list
  app/services/        PayInsights (SQL aggregates), OrgOverview, Pagination
  app/serializers/     The JSON shape of an employee
  app/controllers/api/ Thin controllers
  lib/seeds/           Deterministic 10k employee seeder
docs/                  Requirements and performance notes
```

## How it was built

Each behaviour went through test-driven development: a failing test is committed first (`test:`), then the code that makes it pass (`feat:`), then a refactor when one was needed (`refactor:`). The commit history shows that loop. Performance decisions are backed by measurements in [docs/performance.md](docs/performance.md).
