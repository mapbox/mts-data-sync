# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`mts-data-sync` is a Node.js CLI tool (`mtsds`) that publishes local GeoJSON data to Mapbox's Tiling Service (MTS) API. It handles the full workflow: authentication, configuration, GeoJSON conversion, cost estimation, and publishing.

## Commands

```bash
# Install dependencies
npm install

# Link CLI globally (makes `mtsds` available as a command)
npm link

# Lint
npx eslint src/

# Run the CLI (development)
node index.js --help
node index.js --token       # Set up credentials
node index.js --config file.geojson
node index.js --estimate
node index.js --sync
node index.js --convert file.geojson
```

There are no tests — the `npm test` script is a placeholder that exits with error.

## Architecture

The CLI entry point (`index.js`) loads `.env`, enables ESM via the `esm` package, then delegates to `src/cli.js` which parses arguments with `arg` and routes to command handlers.

**Command → Module mapping:**
- `--token` → `src/token.js` — prompts for Mapbox username/secret token, writes to `.env`
- `--config <file>` → `src/config.js` — prompts for tileset ID/name, writes `mts-config.json` and `mts-recipe.json`, and converts GeoJSON to line-delimited format
- `--convert <file>` → `src/convert.js` — streams GeoJSON to `.geojsonl` (line-delimited format required by MTS)
- `--estimate` → `src/estimate.js` + `src/pricebook.js` — reads config/recipe, calculates tile coverage via `@mapbox/tile-cover`, determines cost using tiered pricing (4 processing tiers × 4 hosting tiers)
- `--sync` → `src/sync.js` + `src/services.js` — full publish workflow: delete old source → upload new `.geojsonl` source → validate recipe → create/update tileset → publish → poll status → open Mapbox Studio

**Generated local files** (excluded from git):
- `.env` — Mapbox credentials (`MAPBOX_USERNAME`, `MAPBOX_TOKEN`)
- `mts-config.json` — tileset ID, name, source ID, path to `.geojsonl`
- `mts-recipe.json` — MTS recipe defining how GeoJSON layers map to vector tile layers

**Key design details:**
- Uses Node.js streams throughout for memory-efficient GeoJSON processing
- `services.js` wraps `@mapbox/mapbox-sdk` tilesets service for all API calls
- `utils.js` provides `readConfig()` and `readRecipe()` helpers that validate file existence
- All source files use ES module syntax (`import`/`export`) transpiled at runtime by the `esm` package

## Code Style

ESLint with `@mapbox/eslint-config-mapbox`. Key rules: `const`/`let` only (no `var`), double quotes, semicolons required, 2-space indentation. Run lint before committing.
