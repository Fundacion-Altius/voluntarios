#!/usr/bin/env node
/**
 * Generates openspec/status.json by scanning openspec/changes/ and
 * openspec/changes/archive/ directly. Deterministic — no LLM involved.
 *
 * Handles the split-repo layout where openspec/ lives at a root that is
 * NOT itself a git repo, while sibling folders (e.g. voluntarios-back/,
 * voluntarios-front/) each have their own .git. In that case:
 *   - "openspec_last_modified" comes from filesystem mtime of the
 *     change's own files (proposal.md/tasks.md/design.md) — the only
 *     signal available since those files aren't git-tracked at the root.
 *   - "code_last_touched" comes from scanning each sibling git repo for
 *     commits/branches whose message or name mentions the change slug —
 *     a real git date, just sourced from a different repo.
 * These are reported as two distinct fields, never silently merged into
 * one, since they answer different questions ("when was the proposal
 * edited" vs "when was matching code committed").
 *
 * If openspec/ root IS itself a git repo, the script uses that directly
 * for both proposal and code dates (the simpler, single-repo case).
 *
 * Usage: node scripts/generate-status.js
 * (run from the directory that directly contains openspec/)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const OPENSPEC_DIR = path.join(ROOT, "openspec");
const CHANGES_DIR = path.join(OPENSPEC_DIR, "changes");
const ARCHIVE_DIR = path.join(CHANGES_DIR, "archive");
const OUTPUT_PATH = path.join(OPENSPEC_DIR, "status.json");

function isGitRepo(dir) {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      cwd: dir,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

function findSiblingGitRepos(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(root, d.name))
    .filter((dir) => fs.existsSync(path.join(dir, ".git")));
}

function gitDatesForPath(repoDir, relPath) {
  try {
    const out = execSync(
      `git log --follow --format=%aI -- "${relPath}"`,
      { cwd: repoDir, stdio: ["ignore", "pipe", "ignore"] }
    )
      .toString()
      .trim();
    if (!out) return { first: null, last: null };
    const dates = out.split("\n").filter(Boolean);
    return { first: dates[dates.length - 1], last: dates[0] };
  } catch {
    return { first: null, last: null };
  }
}

function findCodeActivityForSlug(slug, repoDirs) {
  let latest = null;
  const matchedIn = [];

  for (const repoDir of repoDirs) {
    try {
      const log = execSync(
        `git log --all --format=%aI|%s --grep="${slug}" -i`,
        { cwd: repoDir, stdio: ["ignore", "pipe", "ignore"] }
      )
        .toString()
        .trim();

      const branchOut = execSync(`git branch -a --list "*${slug}*"`, {
        cwd: repoDir,
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim();

      if (log || branchOut) {
        matchedIn.push(path.basename(repoDir));
      }

      if (log) {
        const dates = log
          .split("\n")
          .filter(Boolean)
          .map((line) => line.split("|")[0]);
        for (const d of dates) {
          if (!latest || d > latest) latest = d;
        }
      }
    } catch {
      // no matches found — not an error, just no signal
    }
  }

  return { date: latest, matched_in: matchedIn };
}

function countTasks(tasksMdPath) {
  if (!fs.existsSync(tasksMdPath)) return { total: 0, done: 0 };
  const content = fs.readFileSync(tasksMdPath, "utf-8");
  const total = (content.match(/^\s*-\s*\[[ xX]\]/gm) || []).length;
  const done = (content.match(/^\s*-\s*\[[xX]\]/gm) || []).length;
  return { total, done };
}

function readArchivedDateFromProposal(proposalMdPath) {
  if (!fs.existsSync(proposalMdPath)) return null;
  const content = fs.readFileSync(proposalMdPath, "utf-8");
  const match = content.match(/Archived:\s*(\d{4}-\d{2}-\d{2})/i);
  return match ? match[1] : null;
}

function detectBlocked(dir) {
  const files = ["proposal.md", "design.md", "tasks.md"];
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8").toLowerCase();
      if (/blocked|bloqueo|bloqueado/.test(content)) return true;
    }
  }
  return false;
}

function newestMtime(dir) {
  const files = ["proposal.md", "tasks.md", "design.md"];
  let newest = null;
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) {
      const mtime = fs.statSync(p).mtime.toISOString().slice(0, 10);
      if (!newest || mtime > newest) newest = mtime;
    }
  }
  return newest;
}

function scanChangeDir(dir, slug, isArchived, rootIsGit, siblingRepos) {
  const tasksMd = path.join(dir, "tasks.md");
  const proposalMd = path.join(dir, "proposal.md");
  const { total, done } = countTasks(tasksMd);
  const relPath = path.relative(ROOT, dir);

  let openspecDates;
  let source;
  if (rootIsGit) {
    openspecDates = gitDatesForPath(ROOT, relPath);
    source = "git (root)";
  } else {
    const mtime = newestMtime(dir);
    openspecDates = { first: null, last: mtime };
    source = "filesystem mtime (root has no .git)";
  }

  const codeActivity =
    !rootIsGit && siblingRepos.length > 0
      ? findCodeActivityForSlug(slug, siblingRepos)
      : { date: null, matched_in: [] };

  const archivedDate = isArchived
    ? readArchivedDateFromProposal(proposalMd) || openspecDates.last
    : null;

  let status;
  if (isArchived) {
    status = "archived";
  } else if (total === 0) {
    status = "empty";
  } else if (done === 0) {
    status = "not_started";
  } else if (done === total) {
    status = "ready_to_archive";
  } else {
    status = "in_progress";
  }

  return {
    slug,
    status,
    blocked: detectBlocked(dir),
    tasks_total: total,
    tasks_done: done,
    pct_done: total > 0 ? Math.round((done / total) * 100) : 0,
    archived_date: archivedDate,
    openspec_last_modified: openspecDates.last,
    openspec_date_source: source,
    code_last_touched: codeActivity.date,
    code_activity_matched_in: codeActivity.matched_in,
  };
}

function listSubdirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "archive")
    .map((d) => d.name);
}

function main() {
  if (!fs.existsSync(OPENSPEC_DIR)) {
    console.error(`No openspec/ directory found at ${ROOT}`);
    process.exit(1);
  }

  const rootIsGit = isGitRepo(ROOT);
  const siblingRepos = rootIsGit ? [] : findSiblingGitRepos(ROOT);

  if (!rootIsGit) {
    console.warn(
      `Root at ${ROOT} is not a git repo. openspec_last_modified will use ` +
        `filesystem mtime. Found ${siblingRepos.length} sibling git repo(s) ` +
        `for code_last_touched: ${
          siblingRepos.map((r) => path.basename(r)).join(", ") || "none"
        }`
    );
  }

  const activeSlugs = listSubdirs(CHANGES_DIR);
  const archivedSlugs = listSubdirs(ARCHIVE_DIR);

  const changes = {};

  for (const slug of activeSlugs) {
    changes[slug] = scanChangeDir(
      path.join(CHANGES_DIR, slug),
      slug,
      false,
      rootIsGit,
      siblingRepos
    );
  }

  for (const slug of archivedSlugs) {
    changes[slug] = scanChangeDir(
      path.join(ARCHIVE_DIR, slug),
      slug,
      true,
      rootIsGit,
      siblingRepos
    );
  }

  const manifest = {
    generated: new Date().toISOString(),
    root_is_git: rootIsGit,
    sibling_repos_scanned: siblingRepos.map((r) => path.basename(r)),
    active_count: activeSlugs.length,
    archived_count: archivedSlugs.length,
    changes,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  console.log(
    `Wrote ${OUTPUT_PATH} — ${activeSlugs.length} active, ${archivedSlugs.length} archived.`
  );
}

main();
