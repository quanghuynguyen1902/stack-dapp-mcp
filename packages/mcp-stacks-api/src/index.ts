import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { hiroGet, callReadOnly, cv } from "@stacks-mcp/core";

const server = new McpServer({
  name: "stacks-api",
  version: "0.1.0",
});

// --- Tools ---

server.tool(
  "get_account_balance",
  "Get STX and token balances for a Stacks address",
  { address: z.string().describe("Stacks address (SP... or ST...)") },
  async ({ address }) => {
    const data = await hiroGet(`/extended/v1/address/${address}/balances`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_account_transactions",
  "List recent transactions for a Stacks address",
  {
    address: z.string().describe("Stacks address"),
    limit: z.number().min(1).max(50).default(20).describe("Number of transactions to return"),
    offset: z.number().min(0).default(0).describe("Pagination offset"),
  },
  async ({ address, limit, offset }) => {
    const data = await hiroGet(
      `/extended/v1/address/${address}/transactions?limit=${limit}&offset=${offset}`,
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_block_by_height",
  "Get block information by block height",
  { height: z.number().describe("Block height") },
  async ({ height }) => {
    const data = await hiroGet(`/extended/v2/blocks/${height}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_transaction",
  "Get transaction details by transaction ID",
  { txid: z.string().describe("Transaction ID (hex string)") },
  async ({ txid }) => {
    const data = await hiroGet(`/extended/v1/tx/${txid}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_stx_supply",
  "Get current STX token supply information",
  {},
  async () => {
    const data = await hiroGet("/extended/v1/stx_supply");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "search",
  "Search the Stacks blockchain for blocks, transactions, contracts, or addresses",
  { query: z.string().describe("Search query — block hash, tx ID, contract ID, or address") },
  async ({ query }) => {
    const data = await hiroGet(`/extended/v1/search/${encodeURIComponent(query)}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_contract_source",
  "Get the Clarity source code of a deployed smart contract",
  {
    contract_address: z.string().describe("Contract deployer address (SP...)"),
    contract_name: z.string().describe("Contract name"),
  },
  async ({ contract_address, contract_name }) => {
    const data = await hiroGet(
      `/v2/contracts/source/${contract_address}/${contract_name}`,
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "call_read_only",
  "Call a read-only function on a Stacks smart contract. Arguments must be serialized Clarity values (hex strings starting with 0x).",
  {
    contract_address: z.string().describe("Contract deployer address (SP...)"),
    contract_name: z.string().describe("Contract name"),
    function_name: z.string().describe("Read-only function name"),
    arguments: z.array(z.string()).default([]).describe("Hex-encoded Clarity value arguments"),
    sender: z.string().optional().describe("Sender address for the call (defaults to contract address)"),
  },
  async ({ contract_address, contract_name, function_name, arguments: args, sender }) => {
    const path = `/v2/contracts/call-read/${contract_address}/${contract_name}/${function_name}`;
    const body = {
      sender: sender ?? contract_address,
      arguments: args,
    };
    const data = await (await fetch(`${(await import("@stacks-mcp/core")).getConfig().baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })).json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_address_stx_inbound",
  "Get inbound STX transfers for an address",
  {
    address: z.string().describe("Stacks address"),
    limit: z.number().min(1).max(50).default(20).describe("Number of results"),
  },
  async ({ address, limit }) => {
    const data = await hiroGet(
      `/extended/v1/address/${address}/stx_inbound?limit=${limit}`,
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "get_nft_holdings",
  "Get NFT holdings for a Stacks address",
  {
    address: z.string().describe("Stacks address"),
    limit: z.number().min(1).max(50).default(20).describe("Number of results"),
  },
  async ({ address, limit }) => {
    const data = await hiroGet(
      `/extended/v1/tokens/nft/holdings?principal=${address}&limit=${limit}`,
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

// --- Start ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
