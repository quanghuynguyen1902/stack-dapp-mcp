import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { callReadOnly, cv, hiroGet } from "@stacks-mcp/core";

const SBTC = {
  deployer: "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4",
  token: "sbtc-token",
} as const;

const server = new McpServer({
  name: "stacks-sbtc",
  version: "0.1.0",
});

server.tool(
  "sbtc_get_balance",
  "Get sBTC balance for a Stacks address. sBTC is a 1:1 Bitcoin-backed asset on Stacks.",
  { address: z.string().describe("Stacks address") },
  async ({ address }) => {
    try {
      const result = await callReadOnly(
        SBTC.deployer,
        SBTC.token,
        "get-balance",
        [cv.principal(address)],
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  },
);

server.tool(
  "sbtc_get_total_supply",
  "Get total sBTC supply in circulation on Stacks",
  {},
  async () => {
    try {
      const result = await callReadOnly(
        SBTC.deployer,
        SBTC.token,
        "get-total-supply",
        [],
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  },
);

server.tool(
  "sbtc_get_token_uri",
  "Get sBTC token metadata URI",
  {},
  async () => {
    try {
      const result = await callReadOnly(
        SBTC.deployer,
        SBTC.token,
        "get-token-uri",
        [],
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  },
);

server.tool(
  "sbtc_get_name",
  "Get the sBTC token name",
  {},
  async () => {
    try {
      const result = await callReadOnly(
        SBTC.deployer,
        SBTC.token,
        "get-name",
        [],
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  },
);

server.tool(
  "sbtc_get_symbol",
  "Get the sBTC token symbol",
  {},
  async () => {
    try {
      const result = await callReadOnly(
        SBTC.deployer,
        SBTC.token,
        "get-symbol",
        [],
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  },
);

server.tool(
  "sbtc_get_decimals",
  "Get the sBTC token decimals",
  {},
  async () => {
    try {
      const result = await callReadOnly(
        SBTC.deployer,
        SBTC.token,
        "get-decimals",
        [],
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  },
);

server.tool(
  "sbtc_get_contract_info",
  "Get sBTC contract deployment information and events from Hiro API",
  {},
  async () => {
    try {
      const data = await hiroGet(
        `/extended/v1/contract/${SBTC.deployer}.${SBTC.token}`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
