# Resource Analysis

This repository contains the standalone Resource Analysis UI implementation, request and response validation, transformation and table components, filters, examples, and automated tests.

The detailed implemented API contract is archived at [zz_Specifications/done/resource-analysis-contract.md](./zz_Specifications/done/resource-analysis-contract.md).

## Product ownership

- `ITMPlatform/ITM.Web` owns the integrated product UI under `ITM.Web/src/resourceAnalysis/` and its generated CDN bundle.
- `ITMPlatform/ITM.Tasks` owns the `/v2/{AccountId}/resourceAnalysis` endpoint and server-side tests.
- This repository is a standalone implementation and test bed. Its files are not automatically synchronized with either product repository.

Compare the relevant copies before porting a change and preserve product-specific behavior. Each product repository is validated, committed, pushed, and deployed independently. See [AGENTS.md](./AGENTS.md).

## Main areas

- Root JavaScript and CSS: Resource Analysis UI, request construction, validation, transformations, and flexible table components.
- `FilterConstructor/`: reusable filtering components and tests.
- `tests/`: Vitest unit and UI tests plus local data samples.
- `MockITMPlatform/`: host-application shims for standalone examples.
- `ra-alone.html` and `ra-resources.html`: browser examples.

## Security and test data

Some tracked mock files contain credential-like URLs or production-shaped identifiers. Treat credentials as exposed and data as potentially sensitive. Do not reuse, reproduce, or send it to live services. Removal and rotation are separate security work.

Local configuration can switch between fixture files and an API proxy. Keep automated tests on fixtures; live API calls require explicit authorization and a controlled tenant.

## Validation

Run:

```powershell
npm test -- --run
```

For UI changes, also open the relevant standalone HTML example and verify the affected pivots, filters, date ranges, empty results, and responsive behavior.
