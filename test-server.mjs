#!/usr/bin/env node
/**
 * Smoke test for MCP servers using NDJSON protocol (MCP SDK 1.27+).
 * Usage: node test-server.mjs <package-name>
 */
import { spawn } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = process.argv[2] || "mcp-stacks-api";
const serverPath = resolve(__dirname, `packages/${pkg}/dist/index.js`);

console.log(`Testing: ${pkg}`);
console.log(`Path: ${serverPath}\n`);

const child = spawn(process.execPath, [serverPath], {
  stdio: ["pipe", "pipe", "pipe"],
});

let buffer = "";

child.stdout.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop(); // keep incomplete last line
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      handleResponse(JSON.parse(line));
    } catch {}
  }
});

child.stderr.on("data", () => {});
child.on("exit", (code) => {
  if (code !== null && code !== 0) console.error(`Server exited: ${code}`);
});

function send(msg) {
  child.stdin.write(JSON.stringify(msg) + "\n");
}

function handleResponse(msg) {
  if (msg.id === 1) {
    const info = msg.result?.serverInfo;
    console.log(`Server: ${info?.name} v${info?.version}`);
    send({ jsonrpc: "2.0", id: 2, method: "tools/list" });
  }
  if (msg.id === 2) {
    console.log("\nTools:");
    for (const tool of msg.result?.tools || []) {
      console.log(`  - ${tool.name}: ${tool.description?.substring(0, 80)}`);
    }
    console.log(`\nTotal: ${msg.result?.tools?.length || 0} tools\n`);
    child.kill();
    process.exit(0);
  }
}

setTimeout(() => {
  send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test-client", version: "1.0.0" },
    },
  });
}, 500);

setTimeout(() => {
  console.error("Timeout");
  child.kill();
  process.exit(1);
}, 10000);
