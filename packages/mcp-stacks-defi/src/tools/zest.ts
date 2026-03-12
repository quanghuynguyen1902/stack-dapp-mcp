import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { callReadOnly, cv } from "@stacks-mcp/core";
import { ZEST } from "../contracts/addresses.js";

export function registerZestTools(server: McpServer) {
  server.tool(
    "zest_get_user_reserve_data",
    "Get a user's reserve/lending position data on Zest Protocol",
    {
      user_address: z.string().describe("Stacks address of the user"),
      asset_contract: z.string().describe("Asset contract identifier (e.g. SP...contract-name)"),
    },
    async ({ user_address, asset_contract }) => {
      try {
        const result = await callReadOnly(
          ZEST.deployer,
          ZEST.poolBorrow,
          "get-user-reserve-data",
          [cv.principal(user_address), cv.principal(asset_contract)],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.tool(
    "zest_get_reserve_state",
    "Get the current state of a lending reserve/pool on Zest Protocol",
    {
      asset_contract: z.string().describe("Asset contract identifier"),
    },
    async ({ asset_contract }) => {
      try {
        const result = await callReadOnly(
          ZEST.deployer,
          ZEST.poolBorrow,
          "get-reserve-state",
          [cv.principal(asset_contract)],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.tool(
    "zest_calculate_user_global_data",
    "Calculate aggregate financial data for a user across all Zest Protocol pools",
    {
      user_address: z.string().describe("Stacks address of the user"),
    },
    async ({ user_address }) => {
      try {
        const result = await callReadOnly(
          ZEST.deployer,
          ZEST.poolBorrow,
          "calculate-user-global-data",
          [cv.principal(user_address)],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );
}
