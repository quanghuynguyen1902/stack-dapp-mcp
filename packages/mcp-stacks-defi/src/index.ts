import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerZestTools } from "./tools/zest.js";
import { registerBitflowTools } from "./tools/bitflow.js";
import { registerStackingDaoTools } from "./tools/stacking-dao.js";
import { registerLisaTools } from "./tools/lisa.js";

const server = new McpServer({
  name: "stacks-defi",
  version: "0.1.0",
});

registerZestTools(server);
registerBitflowTools(server);
registerStackingDaoTools(server);
registerLisaTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
