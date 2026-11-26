[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/adheyusuf230801-ship-it/best-national-statistics-site-20261126-0539-codex/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/adheyusuf230801-ship-it/best-national-statistics-site-20261126-0539-codex/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# Lunara Statistics Office

An original, offline-first national statistics portal for the fictional Republic of Lunara. Explore headline indicators and focused population, economy, health, education and environment series, with regional population and GDP accounts, annual change charts, definitions, CSV downloads and methodology notes. The illustrative 2015–2025 values share one local dataset and are identified as fictional in the site.

## Run

Requires Node.js 22 or later. From this directory:

```sh
node serve.ts
```

Open `http://localhost:8080`. To serve a packaged copy, use `node serve.ts --root out/app --port 8080`. The app uses vanilla JavaScript and local SVG; it loads no remote assets or third-party libraries. No dependencies or network access are required.

## Screenshot capture

`shots.json` specifies an overview cover, regional accounts, economy and a 390 × 844 phone view. The make.fun harness captures these after the entry is packaged.

## Data

Eleven annual observations (2015–2025) share a single local dataset. Four named regions report population and GDP; the northern region is calculated as the residual so regional accounts reconcile to national totals. The overview stories and all charts are calculated from these series.

## Package

`MAKEFUN_OUTPUT_DIR=out node main.ts` copies the static app and screenshots and creates a deterministic make.fun dossier using the supplied frontend library. Repeating the command with the same source files produces the same dossier.
