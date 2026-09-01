# Resource Analysis agent instructions

## Required startup

1. Read `README.md` for product ownership and repository structure.
2. Read `zz_Specifications/done/resource-analysis-contract.md` when changing the API contract or validation rules.

## Product repository boundaries

- ITM.Web owns the integrated UI and generated bundle; ITM.Tasks owns the Resource Analysis API.
- This repository is not automatically synchronized with either product copy. Compare implementations before porting a change and do not overwrite product-specific behavior.
- Follow each sibling's instructions and keep validation, commit, push, deployment, and readback separate.

## Data and runtime safety

- Keep automated tests on local fixtures. Do not enable proxy or live API modes without explicit authorization and a controlled tenant.
- Treat credential-like URLs and production-shaped identifiers in tracked mocks as exposed or sensitive. Do not display, copy, or reuse them.
- Use synthetic data in new fixtures and preserve contract coverage for paging, date boundaries, filter combinations, empty results, and totals versus intervals.

## Validation

- Run `npm test -- --run`.
- For UI changes, open the relevant standalone HTML example and verify pivots, row selection, filters, date ranges, empty states, and responsiveness.
- When porting to ITM.Web or ITM.Tasks, run that repository's required tests and product-level E2E checks separately.
