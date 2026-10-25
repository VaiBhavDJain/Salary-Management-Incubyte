# Salary Management — Requirements (v1)

## Goal

ACME's HR team keeps salary data for ~10,000 employees across several countries in Excel files. Finding one person is slow, nothing stops bad data (duplicates, missing or negative salaries), and every question about pay needs a hand-built pivot table.

v1 replaces those files with a web app where the HR manager can **maintain salary records safely** and **answer "how do we pay people?" questions in a few clicks**.

**Persona:** the HR manager. Comfortable with Excel and works with the whole dataset every day.

## Scope & features (v1)

1. **Employee directory.** A server-paginated list of all employees. Search by name or email, filter by country, department and job title, and sort by name or salary.
2. **Manage salary records.** Add, edit and delete an employee. Validation rejects missing fields, non-positive salaries, duplicate emails and unsupported countries.
3. **Pay insights.**
   - For a country: headcount and the min, max, average and median salary.
   - Within a country: the same figures broken down by job title.
   - Org overview: headcount by country and by department.
4. **Seed data.** A script that generates 10,000 realistic employees across 8 countries. It is deterministic, so every run produces the same dataset.
5. **Delivery.** A deployed app and a demo video.

## Data model

`Employee`: `full_name`, `email` (unique), `job_title`, `department`, `country_code` (ISO 3166-1 alpha-2), `salary`.

## Decisions & assumptions

- **Salary** means annual gross base pay, stored as a decimal (never a float) in the employee's **local currency**. Currency is derived from the country, for example IN → INR and US → USD.
- **Pay is compared within a country, never across countries.** Salaries are set per local market. Converting them with exchange rates produces averages that look precise but mislead.
- **Median is shown next to average.** Salary distributions are skewed, so a few high earners pull the average up.
- **Large lists stay on the server.** Pagination, filtering and aggregation run in the database, so the app stays fast at 10k rows and beyond.

## Deliberately left out

| Left out | Why |
|---|---|
| Authentication and roles | v1 has a single persona, and the demo runs on synthetic data. Before real salary data goes in, the app needs company SSO in front of it. |
| Salary history / audit trail | High value, but it turns every edit into versioned data and roughly doubles the model. First candidate for v2. |
| Currency conversion and cross-country comparison | Needs a trusted FX source and policy. Without one, the numbers would be misleading (see above). |
| Payroll, tax, deductions, bonuses, equity | That is payroll, a different domain. This app is a system of record and an insights tool. |
| Excel/CSV import and export | The natural next step for migrating off spreadsheets. The seed script covers v1's demo data. |
| Approvals, notifications, multi-tenancy | Not needed for one HR manager in one organisation. |

## Open questions

Until these are answered, the assumptions above apply.

1. Should insights compare pay across countries? If so, which exchange rates should be used?
2. Which pay questions matter most to the HR manager?
3. Is authentication expected for v1?
4. Is salary history required?
