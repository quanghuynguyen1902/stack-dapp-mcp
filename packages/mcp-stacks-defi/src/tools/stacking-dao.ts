import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { callReadOnly, cv } from "@stacks-mcp/core";
import { STACKING_DAO } from "../contracts/addresses.js";

export function registerStackingDaoTools(server: McpServer) {
  server.tool(
    "stackingdao_get_stx_per_ststx",
    "Get the current stSTX/STX conversion ratio from Stacking DAO. Shows how much STX 1 stSTX is worth.",
    {},
    async () => {
      try {
        const result = await callReadOnly(
          STACKING_DAO.deployer,
          STACKING_DAO.reserve,
          "get-stx-per-ststx",
          [],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.tool(
    "stackingdao_get_total_stacked",
    "Get total amount of STX stacked through Stacking DAO",
    {},
    async () => {
      try {
        const result = await callReadOnly(
          STACKING_DAO.deployer,
          STACKING_DAO.reserve,
          "get-total-stx",
          [],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.tool(
    "stackingdao_get_commission_info",
    "Get Stacking DAO commission/fee information",
    {},
    async () => {
      try {
        const result = await callReadOnly(
          STACKING_DAO.deployer,
          STACKING_DAO.commission,
          "get-commission",
          [],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.tool(
    "stackingdao_get_user_data",
    "Get a user's stacking position and stSTX data from Stacking DAO",
    {
      user_address: z.string().describe("Stacks address of the user"),
    },
    async ({ user_address }) => {
      try {
        const result = await callReadOnly(
          STACKING_DAO.deployer,
          STACKING_DAO.core,
          "get-user-data",
          [cv.principal(user_address)],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );
}
