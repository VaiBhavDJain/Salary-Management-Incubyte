# How AI tools were used

I built this project with **Claude Code** (Anthropic's agentic coding assistant) running in VS Code. I set the direction, the process and the quality bar, and I reviewed the output. The assistant read the brief, wrote code and tests, ran the tools, and reported back with evidence. This page describes that workflow, the instructions I gave, and the cases where verification caught an AI mistake.

## Workflow

1. **Understand before building.** I asked for a detailed reading of the brief before any code. That produced the risks that shaped the design: currency handling across countries, performance at 10k rows, and the clarifying questions listed in `requirements.md`.
2. **Learn the expected style.** I pointed the assistant at a public reference kata and asked it to study the commit history. We kept its red → green → refactor rhythm and avoided its mistakes: empty refactor commits, tests deleted inside green commits, and endpoints added with no tests.
3. **Decide the stack deliberately.** React was required by the brief, so a HAML-only UI was ruled out. Inertia was considered and rejected in favour of a JSON API and a React app in one repository and one deployment.
4. **Requirements first.** The one-page requirements document was the first commit.
5. **Small verified steps.** Each behaviour went the same way: a failing test, confirmed red for the right reason, then the code, then the full suite, lint and security scans. After that came a live check: `curl` against the running API, or a Puppeteer script in a real browser that took screenshots and checked console errors, failed requests and timings.
6. **Human gates.** For the frontend I reviewed and approved commits before they were pushed, and later set a fixed commit budget for the remaining work.

## Instructions I gave (condensed)

- "Read the assignment in detail and explain it properly before building anything."
- "Follow the commit pattern of this example repository, with TDD."
- "Start simple and clean. Keep refactoring, and keep it optimised and fast."
- "Don't add comments in code. Only if really needed: at most two short lines in simple English."
- "Start the servers and test everything live, not just with unit tests."
- "Verify every UI change in the browser. Take screenshots, look at them, and fix until there are zero errors."
- "Tell me before starting the frontend, and before committing and pushing."
- "Finish the remaining work in at most eight commits."

## Where verification caught AI mistakes

Each of these passed the existing tests or looked correct in code review. They were found by running the real thing.

| Found by | Problem | Fix |
|---|---|---|
| Production-mode run | `/` returned 500 in production but passed in tests. `config.x.frontend_index` returns an empty options object, not `nil`, when it is unset | A `class_attribute` with an explicit default, plus specs for the default path and for a missing build |
| Browser, real typing | Typing `1234567.5` into the salary field produced `12,345,675`. The parser dropped the trailing decimal point on each keystroke | Return the cleaned string from the parser. The jsdom test could not reproduce the bug, so that test was deleted rather than kept as false assurance |
| Browser, failure simulation | When the API failed, the error message took about 7s to appear because of the default retries | One retry by default, and no retry on 404 |
| Browser network log | Chrome reported deletes as aborted, because the client never read the body of 204 responses | The client always reads the body and treats an empty body as no data |
| Browser, mobile viewport | The table squeezed names into one character per line, and the nav menu collapsed into "···" | Horizontal table scroll, and the brand name is hidden on small screens |
| Browser, data review | The name-sorted first page showed 25 people called "Aarav Das" | The seed now uses 20–40 first and last names per country |
| Browser, edge case | `?page=401` showed an empty table while pagination said 400 | Out-of-range pages redirect to the last page |
| Measurement | The frontend test suite took 19s | The cause was jsdom style and visibility checks, not the tests themselves. Zero-runtime styles in tests and lighter role queries brought it to about 11s |

## What stayed with me

- The scope trade-offs: local currency only, median alongside average, no authentication in v1.
- The process rules: TDD, commit style, review gates and the commit budget.
- The final call on each change.

The assistant's suggestions were accepted only after the evidence above: failing then passing tests, live API responses, screenshots and measurements.
