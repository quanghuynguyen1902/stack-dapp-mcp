import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { hiroGet } from "@stacks-mcp/core";

const server = new McpServer({
  name: "stacks-stacking",
  version: "0.1.0",
});

server.tool(
  "get_pox_info",
  "Get current Proof of Transfer (PoX) information — cycle length, reward slots, minimum threshold",
  {},
  async () => {
    const data = await hiroGet("/v2/pox");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_pox_cycles",
  "List PoX stacking cycles with pagination",
  {
    limit: z.number().min(1).max(60).default(20).describe("Number of cycles to return"),
    offset: z.number().min(0).default(0).describe("Pagination offset"),
  },
  async ({ limit, offset }) => {
    const data = await hiroGet(`/extended/v2/pox/cycles?limit=${limit}&offset=${offset}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_pox_cycle",
  "Get details for a specific PoX cycle",
  {
    cycle_number: z.number().describe("PoX cycle number"),
  },
  async ({ cycle_number }) => {
    const data = await hiroGet(`/extended/v2/pox/cycles/${cycle_number}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_pox_cycle_signers",
  "Get signers participating in a specific PoX cycle",
  {
    cycle_number: z.number().describe("PoX cycle number"),
    limit: z.number().min(1).max(100).default(20).describe("Number of signers to return"),
    offset: z.number().min(0).default(0).describe("Pagination offset"),
  },
  async ({ cycle_number, limit, offset }) => {
    const data = await hiroGet(
      `/extended/v2/pox/cycles/${cycle_number}/signers?limit=${limit}&offset=${offset}`,
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_pox_cycle_signer",
  "Get details for a specific signer in a PoX cycle",
  {
    cycle_number: z.number().describe("PoX cycle number"),
    signer_key: z.string().describe("Signer's public key (hex)"),
  },
  async ({ cycle_number, signer_key }) => {
    const data = await hiroGet(
      `/extended/v2/pox/cycles/${cycle_number}/signers/${signer_key}`,
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_pox_cycle_stackers",
  "Get stackers delegating to a signer in a PoX cycle",
  {
    cycle_number: z.number().describe("PoX cycle number"),
    signer_key: z.string().describe("Signer's public key (hex)"),
    limit: z.number().min(1).max(100).default(20).describe("Number of stackers to return"),
    offset: z.number().min(0).default(0).describe("Pagination offset"),
  },
  async ({ cycle_number, signer_key, limit, offset }) => {
    const data = await hiroGet(
      `/extended/v2/pox/cycles/${cycle_number}/signers/${signer_key}/stackers?limit=${limit}&offset=${offset}`,
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_network_block_times",
  "Get average Bitcoin and Stacks block times",
  {},
  async () => {
    const data = await hiroGet("/extended/v1/info/network_block_times");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
