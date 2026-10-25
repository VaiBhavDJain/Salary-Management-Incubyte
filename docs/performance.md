# Performance notes

All numbers below are for **10,000 seeded employees** on local PostgreSQL 16. Query times come from `EXPLAIN ANALYZE`; HTTP times come from `curl` against the development server.

## Design choices that keep the app fast

- **Server-side pagination.** The list returns 25 rows by default and never more than 100. One request never loads all 10k rows.
- **Aggregates run in SQL.** Every insight figure (count, min, max, average, median) for a group comes from a single query. Median uses `PERCENTILE_CONT(0.5)`, so no salaries are loaded into Ruby.
- **Bulk seeding.** The seed uses `insert_all` in batches of 1,000 and loads 10k rows in about 1.5s. Because bulk inserts skip model validations, NOT NULL columns, a `salary > 0` check and a unique email index protect the data at the database level.

## Indexes, before and after

| Query | No index | With index | Index |
|---|---|---|---|
| First page of the list, ordered by name | 1.9 ms | 0.04 ms | `(full_name, id)` |
| Filter by country and department | 2.1 ms | 0.04 ms | `(full_name, id)` |
| Filter by department | 1.4 ms | 0.2 ms | `department` |
| Pay insights for one country, by job title | 3.9 ms | 0.5 ms | `(country_code, job_title)` |

With the indexes in place, every API endpoint responds in under 35 ms over HTTP on 10k rows, including Rails overhead.

## Measured, but deliberately not done yet

| Option | Measurement | Why not now |
|---|---|---|
| Trigram index (`pg_trgm`) for search | A rare term went from 13 ms to 0.14 ms. A common term stayed around 9 ms. | It adds a Postgres extension dependency for a query that is already fast at 10k rows. Add it when search slows down as data grows. |
| Keyset pagination | The last page (offset 9,975) takes 9–12 ms with or without an index. | HR users narrow the list with search and filters instead of paging deep. Offset pagination keeps "jump to page N" simple. |
| Caching insights | Insight queries already finish in under 4 ms without an index. | A cache brings invalidation on every salary edit for no visible gain. |
