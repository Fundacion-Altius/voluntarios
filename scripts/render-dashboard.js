#!/usr/bin/env node
/**
 * Renders status-dashboard-technical-<date>.html directly from
 * openspec/status.json — no LLM involved in producing the HTML. This is
 * what project-status-report should run instead of asking the agent to
 * write HTML by hand each time.
 *
 * Includes a freshness check: if a report already exists and nothing in
 * openspec/ has changed since it was generated, it skips rendering
 * entirely and tells you to reuse the existing file — this is what
 * avoids burning tokens (and now, compute) on unnecessary regeneration.
 *
 * Usage:
 *   node scripts/render-dashboard.js                  (uses cwd as root)
 *   node scripts/render-dashboard.js --path ~/dev/voluntarios
 *   node scripts/render-dashboard.js --path . --force  (skip freshness check)
 *
 * Requires openspec/status.json to exist — run generate-status.js first.
 */

const fs = require("fs");
const path = require("path");

function resolveArgs() {
  const args = process.argv.slice(2);
  const pathFlagIndex = args.indexOf("--path");
  const root =
    pathFlagIndex !== -1 && args[pathFlagIndex + 1]
      ? path.resolve(args[pathFlagIndex + 1])
      : args[0] && !args[0].startsWith("-")
      ? path.resolve(args[0])
      : process.cwd();
  const force = args.includes("--force");
  return { root, force };
}

function newestMtimeRecursive(dir) {
  let newest = null;
  if (!fs.existsSync(dir)) return newest;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = newestMtimeRecursive(p);
      if (sub && (!newest || sub > newest)) newest = sub;
    } else {
      const mtime = fs.statSync(p).mtime;
      if (!newest || mtime > newest) newest = mtime;
    }
  }
  return newest;
}

function findExistingReport(root) {
  const files = fs
    .readdirSync(root)
    .filter(
      (f) => f.startsWith("status-dashboard-technical-") && f.endsWith(".html")
    )
    .sort()
    .reverse();
  return files[0] ? path.join(root, files[0]) : null;
}

function getEmbeddedGeneratedTime(reportPath) {
  const content = fs.readFileSync(reportPath, "utf-8");
  const match = content.match(/<!-- generated-at: (.+?) -->/);
  return match ? new Date(match[1]) : null;
}

function checkFreshness(root, force) {
  if (force) return { fresh: false, reason: "--force passed" };

  const existing = findExistingReport(root);
  if (!existing) return { fresh: false, reason: "no existing report found" };

  const reportTime = getEmbeddedGeneratedTime(existing);
  if (!reportTime) return { fresh: false, reason: "existing report unreadable" };

  const changesDir = path.join(root, "openspec", "changes");
  const statusJsonPath = path.join(root, "openspec", "status.json");
  const newestSource = newestMtimeRecursive(changesDir);
  const statusJsonMtime = fs.existsSync(statusJsonPath)
    ? fs.statSync(statusJsonPath).mtime
    : null;

  const newestOverall = [newestSource, statusJsonMtime]
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  if (newestOverall && newestOverall > reportTime) {
    return { fresh: false, reason: "source files changed since last report" };
  }

  return { fresh: true, existingPath: existing };
}

function statusBadge(status) {
  const map = {
    done: { label: "Done", color: "#3ecf6e" },
    done_unverified: { label: "Done (unverified)", color: "#e0a530" },
    in_progress: { label: "In Progress", color: "#4a9eff" },
    not_started: { label: "Not Started", color: "#8a8f98" },
    blocked: { label: "Blocked", color: "#e05a4e" },
    empty: { label: "Empty", color: "#5a5f68" },
    ready_to_archive: { label: "Ready to Archive", color: "#3ecf6e" },
    archived: { label: "Archived", color: "#3ecf6e" },
  };
  const s = map[status] || { label: status, color: "#8a8f98" };
  return `<span class="badge" style="background:${s.color}22;color:${s.color};border:1px solid ${s.color}55">${s.label}</span>`;
}

function computeAggregates(changes) {
  const active = Object.values(changes).filter((c) => c.status !== "archived");
  const archived = Object.values(changes).filter((c) => c.status === "archived");
  const blocked = active.filter((c) => c.blocked);
  const notStarted = active.filter((c) => c.status === "not_started");
  const inProgress = active.filter((c) => c.status === "in_progress");

  const totalTasks = Object.values(changes).reduce((s, c) => s + c.tasks_total, 0);
  const doneTasks = Object.values(changes).reduce((s, c) => s + c.tasks_done, 0);
  const overallPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const today = new Date();
  const stale = active.filter((c) => {
    const last = c.code_last_touched || c.openspec_last_modified || c.last_touched;
    if (!last) return false;
    const days = (today - new Date(last)) / (1000 * 60 * 60 * 24);
    return days >= 14;
  });

  return { active, archived, blocked, notStarted, inProgress, overallPct, stale };
}

function recommendNextActions(changes) {
  const active = Object.values(changes).filter((c) => c.status !== "archived");
  const recs = [];

  const blocked = active.filter((c) => c.blocked);
  for (const c of blocked.slice(0, 2)) {
    recs.push(`Resolve the blocker on <code>${c.slug}</code> — clearing it unblocks further progress.`);
  }

  const closest = active
    .filter((c) => c.status === "in_progress" && !c.blocked)
    .sort((a, b) => b.pct_done - a.pct_done)[0];
  if (closest && recs.length < 3) {
    recs.push(`Finish <code>${closest.slug}</code> — already at ${closest.pct_done}%, closest to done.`);
  }

  if (recs.length < 3) {
    const notStarted = active.find((c) => c.status === "not_started");
    if (notStarted) {
      recs.push(`Start <code>${notStarted.slug}</code> — no work begun yet.`);
    }
  }

  return recs.slice(0, 3);
}

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const date = d.toISOString().slice(0, 10);
    const time = d.toISOString().slice(11, 16);
    return `${date} ${time}`;
  } catch {
    return iso;
  }
}

function render(manifest, projectName) {
  const { active, archived, blocked, notStarted, overallPct, stale } =
    computeAggregates(manifest.changes);
  const recs = recommendNextActions(manifest.changes);
  const generatedAt = new Date().toISOString();

  const activeRows = active
    .sort((a, b) => (b.blocked ? 1 : 0) - (a.blocked ? 1 : 0))
    .map(
      (c) => `
    <tr>
      <td><code>${c.slug}</code></td>
      <td>${statusBadge(c.blocked ? "blocked" : c.status)}</td>
      <td>
        <div class="progress-bar"><div class="progress-fill" style="width:${c.pct_done}%"></div></div>
        <span class="pct">${c.pct_done}%</span>
      </td>
      <td>${formatDateTime(c.code_last_touched || c.openspec_last_modified)}</td>
    </tr>`
    )
    .join("");

  const archivedRows = archived
    .slice(0, 30)
    .sort((a, b) => {
      const da = a.archived_date ? new Date(a.archived_date).getTime() : 0;
      const db = b.archived_date ? new Date(b.archived_date).getTime() : 0;
      return db - da;
    })
    .map(
      (c) => `
    <tr>
      <td><code>${c.slug}</code></td>
      <td>${statusBadge(c.status === "archived" && c.tasks_done < c.tasks_total ? "done_unverified" : "done")}</td>
      <td>${formatDateTime(c.archived_date)}</td>
    </tr>`
    )
    .join("");

  const recItems = recs
    .map((r, i) => `<li><strong>${i + 1}.</strong> ${r}</li>`)
    .join("");

  return `<!DOCTYPE html>
<!-- generated-at: ${generatedAt} -->
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${projectName} — Project Status Report</title>
<style>
  :root {
    --bg: #12141a; --bg-card: #1a1d24; --border: #2a2e38;
    --text: #e8e9ed; --text-dim: #8a8f98; --accent: #3ecf6e;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    padding: 32px 24px;
  }
  code, .mono { font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .subtitle { color: var(--text-dim); font-size: 13px; margin: 0 0 24px; }
  .header-row { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
  .hero-pct { font-size: 40px; font-weight: 700; color: var(--accent); text-align: right; }
  .hero-label { font-size: 11px; color: var(--text-dim); text-align: right; letter-spacing: 0.05em; }
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 24px 0; }
  .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
  .stat-num { font-size: 26px; font-weight: 700; }
  .stat-label { font-size: 12px; color: var(--text-dim); margin-top: 4px; }
  section { margin: 32px 0; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-dim); margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; color: var(--text-dim); font-weight: 500; padding: 8px; border-bottom: 1px solid var(--border); font-size: 11px; text-transform: uppercase; }
  td { padding: 10px 8px; border-bottom: 1px solid var(--border); }
  .badge { font-size: 11px; padding: 3px 8px; border-radius: 4px; white-space: nowrap; }
  .progress-bar { display: inline-block; width: 60px; height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; vertical-align: middle; }
  .progress-fill { height: 100%; background: var(--accent); }
  .pct { font-size: 11px; color: var(--text-dim); margin-left: 6px; }
  .callout { background: var(--bg-card); border-left: 3px solid var(--accent); border-radius: 4px; padding: 14px 16px; font-size: 13px; }
  ul { padding-left: 0; list-style: none; }
  ul li { padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  @media (max-width: 600px) {
    .header-row { flex-direction: column; }
    .hero-pct, .hero-label { text-align: left; }
    table, thead, tbody, th, td, tr { display: block; }
    th { display: none; }
    td { border: none; padding: 4px 0; }
    tr { border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px; }
  }
</style>
</head>
<body>
  <div class="header-row">
    <div>
      <h1>${projectName} — Project Status Report</h1>
      <p class="subtitle">Generated ${generatedAt.slice(0, 10)} · Technical mode · Rendered by render-dashboard.js</p>
    </div>
    <div>
      <div class="hero-pct">${overallPct}%</div>
      <div class="hero-label">OVERALL COMPLETION</div>
    </div>
  </div>

  <div class="stat-grid">
    <div class="stat-card"><div class="stat-num">${active.length}</div><div class="stat-label">Active changes</div></div>
    <div class="stat-card"><div class="stat-num">${archived.length}</div><div class="stat-label">Archived changes</div></div>
    <div class="stat-card"><div class="stat-num">${blocked.length}</div><div class="stat-label">Blocked</div></div>
    <div class="stat-card"><div class="stat-num">${stale.length}</div><div class="stat-label">Stale (14d+)</div></div>
  </div>

  <section>
    <h2>Active Changes</h2>
    <table>
      <thead><tr><th>Change ID</th><th>Status</th><th>% Done</th><th>Last Touched</th></tr></thead>
      <tbody>${activeRows || '<tr><td colspan="4">No active changes.</td></tr>'}</tbody>
    </table>
  </section>

  <section>
    <h2>Recently Archived</h2>
    <table>
      <thead><tr><th>Change ID</th><th>Status</th><th>Archived</th></tr></thead>
      <tbody>${archivedRows || '<tr><td colspan="3">No archived changes.</td></tr>'}</tbody>
    </table>
  </section>

  <section>
    <h2>Recommended Next Actions</h2>
    <ul>${recItems || "<li>Nothing urgent detected.</li>"}</ul>
  </section>

  <section>
    <div class="callout">
      Rendered deterministically from <code class="mono">openspec/status.json</code> —
      no LLM was used to generate this HTML. Run
      <code class="mono">node scripts/generate-status.js</code> first if this
      looks stale.
    </div>
  </section>
</body>
</html>`;
}

function main() {
  const { root, force } = resolveArgs();
  const statusJsonPath = path.join(root, "openspec", "status.json");

  if (!fs.existsSync(statusJsonPath)) {
    console.error(
      `No openspec/status.json found at ${root}. Run generate-status.js first.`
    );
    process.exit(1);
  }

  const freshness = checkFreshness(root, force);
  if (freshness.fresh) {
    console.log(
      `Existing report is up to date: ${freshness.existingPath}\n` +
        `Nothing changed since it was generated — reusing it instead of ` +
        `regenerating. Pass --force to regenerate anyway.`
    );
    process.exit(0);
  }

  console.log(`Regenerating report (${freshness.reason})...`);

  const manifest = JSON.parse(fs.readFileSync(statusJsonPath, "utf-8"));
  const projectName = path.basename(root);
  const html = render(manifest, projectName);

  const today = new Date().toISOString().slice(0, 10);
  const outPath = path.join(root, `status-dashboard-technical-${today}.html`);
  fs.writeFileSync(outPath, html);

  console.log(`Wrote ${outPath}`);
}

main();
