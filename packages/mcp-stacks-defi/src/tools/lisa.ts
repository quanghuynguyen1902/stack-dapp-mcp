import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { callReadOnly, cv } from "@stacks-mcp/core";
import { LISA } from "../contracts/addresses.js";

export function registerLisaTools(server: McpServer) {
  server.tool(
    "lisa_get_balance",
    "Get LiSTX token balance for an address on LISA Protocol",
    {
      address: z.string().describe("Stacks address"),
    },
    async ({ address }) => {
      try {
        const result = await callReadOnly(
          LISA.deployer,
          LISA.token,
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
    "lisa_get_total_supply",
    "Get total supply of LiSTX tokens on LISA Protocol",
    {},
    async () => {
      try {
        const result = await callReadOnly(
          LISA.deployer,
          LISA.token,
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
    "lisa_get_token_uri",
    "Get LiSTX token metadata URI from LISA Protocol",
    {},
    async () => {
      try {
        const result = await callReadOnly(
          LISA.deployer,
          LISA.token,
          "get-token-uri",
          [],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );
}
