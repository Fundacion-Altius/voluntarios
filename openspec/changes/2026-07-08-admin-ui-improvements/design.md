## Context

The admin dashboard has three recharts-based charts (line, pie, bar) that currently use monochrome CSS variables (`--primary`, `--muted-foreground`) for their series colors. In both light and dark mode these produce near-B&W visuals. The shadcn Button component also lacks `cursor: pointer` which is expected UX. The project already defines `--chart-1` through `--chart-5` CSS variables in `globals.css` for both color schemes, but the charts don't use them.

## Goals / Non-Goals

**Goals:**
- Add `cursor: pointer` to shadcn button hover state
- Replace monochrome chart colors with theme-aware distinct colors using existing `--chart-*` CSS variables
- Charts remain legible in both light and dark mode
- Stage/commit pending frontend changes and branch from `dev`

**Non-Goals:**
- No new chart types or visualizations
- No structural/layout changes to the dashboard
- No backend API changes
- No changes to the chart library (stays on recharts)

## Decisions

1. **Button cursor**: Add `cursor: pointer` directly to the base `buttonVariants` className string. This is a one-line change, no new dependency needed. Alternative considered: using Tailwind `cursor-pointer` class — same result, but the shadcn base uses plain CSS utility strings, so adding it inline is consistent.

2. **Chart colors**: Use `--chart-1` through `--chart-5` (already defined in `globals.css` for both color schemes) instead of `--primary`/`--muted-foreground`. These variables are designed by the shadcn/ui team for exactly this use case — they provide 5 distinct, accessible colors that shift appropriately per theme. No need to define new variables.

   - Line chart (single series): `stroke="hsl(var(--chart-1))"` and `dot={{ fill: "hsl(var(--chart-1))", stroke: "hsl(var(--chart-1))" }}`
   - Bar chart (single series): `fill="hsl(var(--chart-1))"` (single color bar is fine, but could use `--chart-2` or `--chart-3` for variety)
   - Pie chart (two series): `['hsl(var(--chart-2))', 'hsl(var(--chart-5))']` (distinct hues, not adjacent on the palette)

3. **Git workflow**: 
   - `git add` pending changes in `voluntarios-front/`
   - Commit with message `chore: stage pending frontend changes`
   - Branch from `dev` as `feat/admin-ui-improvements`

4. **Tooltip/legend**: No changes needed — Tooltip and Legend components inherit theme-aware styles automatically.

## Risks / Trade-offs

- [Risk] `--chart-*` variables might render similarly in dark mode on some displays → Mitigation: the shadcn default palette already accounts for this; test toggling theme before shipping.
- [Risk] Committing frontend changes that include generated files → Mitigation: review `git diff` before staging; exclude non-essential files.
