import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { callReadOnly, cv, hiroGet } from "@stacks-mcp/core";
import { BITFLOW } from "../contracts/addresses.js";

export function registerBitflowTools(server: McpServer) {
  server.tool(
    "bitflow_get_pair_data",
    "Get trading pair data from BitFlow DEX including reserves and fees",
    {
      token_x: z.string().describe("Token X contract identifier (e.g. SP...token-contract)"),
      token_y: z.string().describe("Token Y contract identifier"),
    },
    async ({ token_x, token_y }) => {
      try {
        const result = await callReadOnly(
          BITFLOW.deployer,
          BITFLOW.core,
          "get-pair-data",
          [cv.principal(token_x), cv.principal(token_y)],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.tool(
    "bitflow_get_swap_rate",
    "Calculate the expected output amount for a swap on BitFlow DEX",
    {
      token_x: z.string().describe("Input token contract identifier"),
      token_y: z.string().describe("Output token contract identifier"),
      amount: z.number().describe("Input amount in smallest unit (micro-tokens)"),
    },
    async ({ token_x, token_y, amount }) => {
      try {
        const result = await callReadOnly(
          BITFLOW.deployer,
          BITFLOW.core,
          "get-helper",
          [cv.principal(token_x), cv.principal(token_y), cv.uint(amount)],
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.tool(
    "bitflow_get_contract_info",
    "Get BitFlow DEX contract information and events",
    {},
    async () => {
      try {
        const data = await hiroGet(
          `/extended/v1/contract/${BITFLOW.deployer}.${BITFLOW.core}`,
        );
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );
}
