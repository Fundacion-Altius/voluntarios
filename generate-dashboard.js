const fs = require('fs');
const path = require('path');

const CACHE_TTL_HOURS = 2; 
const STATUS_JSON_PATH = path.join(__dirname, 'openspec/status.json');
const DASHBOARD_HTML_PATH = path.join(__dirname, 'status-dashboard.html');

function shouldRegenerate() {
    if (!fs.existsSync(DASHBOARD_HTML_PATH)) return true;
    if (!fs.existsSync(STATUS_JSON_PATH)) return false;
    
    const htmlStats = fs.statSync(DASHBOARD_HTML_PATH);
    const jsonStats = fs.statSync(STATUS_JSON_PATH);
    
    if (jsonStats.mtime > htmlStats.mtime) return true;
    
    const ageInHours = (Date.now() - htmlStats.mtimeMs) / (1000 * 60 * 60);
    return ageInHours > CACHE_TTL_HOURS;
}

function classifyChange(c) {
    if (c.blocked) return 'Blocked';
    if (c.status === 'archived') return 'Done';
    return 'In-Progress';
}

function buildHtml(data) {
    const changes = data.changes || {};
    const changeKeys = Object.keys(changes);

    const STALE_DAYS = 14;
    const now = Date.now();

    let totalChanges = 0;
    let completedChanges = 0;
    let blockedChanges = 0;
    let inProgressChanges = 0;
    let staleChanges = 0;

    changeKeys.forEach(k => {
        const c = changes[k];
        totalChanges++;
        const cls = classifyChange(c);
        if (cls === 'Blocked') blockedChanges++;
        else if (cls === 'Done') completedChanges++;
        else inProgressChanges++;

        const ref = c.code_last_touched || c.openspec_last_modified;
        if (ref) {
            const t = new Date(ref).getTime();
            if (!isNaN(t) && (now - t) / (1000 * 60 * 60 * 24) > STALE_DAYS) staleChanges++;
        }
    });

    const completionRate = totalChanges > 0 ? Math.round((completedChanges / totalChanges) * 100) : 0;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Project Status Dashboard</title>
<style>
  :root { 
    --bg:#12141A; 
    --surface:#1A1D24; 
    --border:#2A2E38; 
    --text:#E4E6EC; 
    --muted:#8B8F9A; 
    --accent:#4F8EF7; 
    --success:#2DD4A8; 
    --warning:#F59E4B; 
    --danger:#F25757; 
    --info:#8B9EF7; 
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.45; padding: 24px; }
  .container { max-width: 1200px; margin: 0 auto; }
  header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .project-name { font-size: 22px; font-weight: 700; }
  .meta { color: var(--muted); font-size: 13px; margin-top: 4px; }
  
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); padding: 20px; border-radius: 8px; }
  .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .stat-value { font-size: 28px; font-weight: 700; font-family: ui-monospace, monospace; }
  .stat-value.accent { color: var(--accent); }
  .stat-value.warning { color: var(--warning); }
  
  .section { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 24px; margin-bottom: 24px; }
  .section-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px; color: var(--muted); }
  
  table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
  th { color: var(--muted); font-weight: 500; padding: 10px 12px; border-bottom: 2px solid var(--border); }
  td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
  
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; color: #cbd5e1; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
  .badge.Done { background: rgba(45, 212, 168, 0.15); color: var(--success); }
  .badge.In-Progress { background: rgba(79, 142, 247, 0.15); color: var(--accent); }
  .badge.Blocked { background: rgba(242, 87, 87, 0.15); color: var(--danger); }
  
  .progress-bar-bg { background: var(--border); width: 80px; height: 6px; border-radius: 3px; display: inline-block; vertical-align: middle; margin-right: 8px; overflow: hidden; }
  .progress-bar-fill { background: var(--accent); height: 100%; border-radius: 3px; }
  .progress-bar-fill.done { background: var(--success); }
  
  .callout { background: rgba(245, 158, 75, 0.05); border-left: 4px solid var(--warning); padding: 16px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.6; }
</style>
</head>
<body>
<div class="container">
  <header>
    <div>
      <div class="project-name">Project Status Dashboard</div>
      <div class="meta">Última actualización: ${new Date().toLocaleString()} &middot; Source: openspec/status.json</div>
    </div>
  </header>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Overall Completion</div>
      <div class="stat-value accent">${completionRate}%</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active Changes</div>
      <div class="stat-value">${inProgressChanges + blockedChanges}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Archived / Done</div>
      <div class="stat-value">${completedChanges}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Stale (14+ Days)</div>
      <div class="stat-value ${staleChanges > 0 ? 'warning' : ''}">${staleChanges}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Active Changes & Core Metrics</div>
    <table>
      <thead>
        <tr>
          <th>Change ID</th>
          <th>Title / Intent</th>
          <th>Status</th>
          <th>% Done</th>
        </tr>
      </thead>
      <tbody>
        ${changeKeys.map(k => {
            const c = changes[k];
            const pct = c.pct_done || 0;
            const cls = classifyChange(c);
            const label = cls === 'In-Progress' ? 'In Progress' : cls;
            return `
              <tr>
                <td class="mono">${k}</td>
                <td><strong>${c.slug || k}</strong><br><span style="color:var(--muted); font-size:12px;">${c.archived_date ? 'Archived ' + c.archived_date : 'Active · ' + (c.tasks_done || 0) + '/' + (c.tasks_total || 0) + ' tasks'}</span></td>
                <td><span class="badge ${cls}">${label}</span></td>
                <td>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${cls === 'Done' ? 'done' : ''}" style="width: ${pct}%"></div>
                  </div>
                  <span class="mono">${pct}%</span>
                </td>
              </tr>
            `;
        }).join('')}
      </tbody>
    </table>
  </div>

  ${blockedChanges > 0 ? `
  <div class="section">
    <div class="section-title">Blockers & Risks</div>
    <div class="callout">
      <strong>Active Blockers tracked in OpenSpec:</strong>
      <ul>
        ${changeKeys.filter(k => changes[k].blocked).map(k => `
          <li><span class="mono">${k}</span>: ${changes[k].blockerDetail || 'Revisar notas pendientes en proposal.md.'}</li>
        `).join('')}
      </ul>
    </div>
  </div>` : ''}

</div>
</body>
</html>`;
}

function main() {
    if (!shouldRegenerate()) {
        console.log(JSON.stringify({ status: "success", action: "skipped", path: DASHBOARD_HTML_PATH }));
        process.exit(0);
    }

    if (!fs.existsSync(STATUS_JSON_PATH)) {
        console.log(JSON.stringify({ status: "error", code: "NO_DATA" }));
        process.exit(1);
    }

    try {
        const rawData = fs.readFileSync(STATUS_JSON_PATH, 'utf8');
        const jsonData = JSON.parse(rawData);
        
        const htmlContent = buildHtml(jsonData);
        
        fs.writeFileSync(DASHBOARD_HTML_PATH, htmlContent);
        console.log(JSON.stringify({ status: "success", action: "regenerated", path: DASHBOARD_HTML_PATH }));
    } catch (e) {
        console.log(JSON.stringify({ status: "error", code: "FAILED", message: e.message }));
        process.exit(1);
    }
}

main();