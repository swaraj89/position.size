import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const workflow = readFileSync(
  new URL("../.github/workflows/deploy.yml", import.meta.url),
  "utf8",
);
const remote = workflow
  .split("<<'REMOTE'\n")[1]
  .split("\n          REMOTE")[0]
  .replace(/^ {10}/gm, "");

test("remote deployment checks explain each failure and allow valid prerequisites", () => {
  const scenarios = [
    [1, 0, 0, 0, "Cannot create VPS_TARGET_DIR"],
    [0, 1, 0, 0, "write and traversal permissions"],
    [0, 0, 1, 0, "write and traversal permissions"],
    [0, 0, 0, 1, "rsync is missing"],
    [0, 0, 0, 0, "Deployment prerequisites passed"],
  ];
  for (const [
    mkdirStatus,
    writeStatus,
    traverseStatus,
    rsyncStatus,
    message,
  ] of scenarios) {
    // Stub remote commands: no real SSH or filesystem mutations.
    const prelude = `mkdir() { return ${mkdirStatus}; }\ntest() { case "$1" in -w) return ${writeStatus};; -x) return ${traverseStatus};; esac; }\ncommand() { return ${rsyncStatus}; }\n`;
    const execution = spawnSync("sh", ["-s", "--", "/example/site"], {
      input: prelude + remote,
      encoding: "utf8",
    });
    assert.equal(
      execution.status,
      mkdirStatus || writeStatus || traverseStatus || rsyncStatus,
    );
    assert.ok((execution.stdout + execution.stderr).includes(message));
  }
});
