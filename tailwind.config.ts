# Bracket Helper starter

Next.js starter for a Splinterlands bracket analysis app.

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Optional:

```bash
SPLINTERLANDS_API_BASE_URL=https://api.splinterlands.com
```

## Notes

- Deduplicates cards by `card_detail_id` and keeps the highest owned level.
- Excludes cards below bracket minimums.
- Scales cards above bracket maximums down to the bracket cap.
- Modern legality currently uses heuristic metadata and edition hints.
- Replace the placeholder level fallback with exact XP/BCX conversion rules if needed.
