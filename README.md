# Stacks MCP Servers

Open-source MCP (Model Context Protocol) servers for the **Stacks blockchain ecosystem** — enabling AI agents to interact with Bitcoin DeFi, sBTC, stacking, and more through natural language.

## Packages

| Package | Description | Tools |
|---------|------------|-------|
| **@stacks-mcp/stacks-api** | Core Stacks blockchain API — accounts, blocks, transactions, search | 10 |
| **@stacks-mcp/stacks-defi** | DeFi protocol integration — Zest, BitFlow, Stacking DAO, LISA | 13 |
| **@stacks-mcp/stacks-sbtc** | sBTC (Bitcoin-backed asset) — balances, supply, token info | 7 |
| **@stacks-mcp/stacks-stacking** | Stacking/PoX — cycles, signers, stackers, yield | 7 |
| **@stacks-mcp/core** | Shared utilities — Hiro API client, Clarity value helpers | — |

**37 tools** total across 4 MCP servers.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm

### Install & Build

```bash
pnpm install
pnpm build
```

### Configure Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stacks-api": {
      "command": "node",
      "args": ["/path/to/stacks-mcp/packages/mcp-stacks-api/dist/index.js"]
    },
    "stacks-defi": {
      "command": "node",
      "args": ["/path/to/stacks-mcp/packages/mcp-stacks-defi/dist/index.js"]
    },
    "stacks-sbtc": {
      "command": "node",
      "args": ["/path/to/stacks-mcp/packages/mcp-stacks-sbtc/dist/index.js"]
    },
    "stacks-stacking": {
      "command": "node",
      "args": ["/path/to/stacks-mcp/packages/mcp-stacks-stacking/dist/index.js"]
    }
  }
}
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `STACKS_NETWORK` | `mainnet` | Network to use (`mainnet` or `testnet`) |
| `HIRO_API_KEY` | — | Optional Hiro API key (increases rate limit from 50 to 500 RPM) |

## Tools Reference

### stacks-api

| Tool | Description |
|------|-------------|
| `get_account_balance` | Get STX and token balances for a Stacks address |
| `get_account_transactions` | List recent transactions for an address |
| `get_block_by_height` | Get block information by height |
| `get_transaction` | Get transaction details by ID |
| `get_stx_supply` | Get current STX supply information |
| `search` | Search blocks, transactions, contracts, or addresses |
| `get_contract_source` | Get Clarity source code of a deployed contract |
| `call_read_only` | Call any read-only smart contract function |
| `get_address_stx_inbound` | Get inbound STX transfers |
| `get_nft_holdings` | Get NFT holdings for an address |

### stacks-defi

**Zest Protocol** (Lending)
| Tool | Description |
|------|-------------|
| `zest_get_user_reserve_data` | User's lending position data |
| `zest_get_reserve_state` | Current pool/reserve state |
| `zest_calculate_user_global_data` | Aggregate user data across pools |

**BitFlow** (DEX)
| Tool | Description |
|------|-------------|
| `bitflow_get_pair_data` | Trading pair info and reserves |
| `bitflow_get_swap_rate` | Calculate swap output amount |
| `bitflow_get_contract_info` | DEX contract information |

**Stacking DAO** (Liquid Stacking)
| Tool | Description |
|------|-------------|
| `stackingdao_get_stx_per_ststx` | stSTX/STX conversion ratio |
| `stackingdao_get_total_stacked` | Total STX stacked |
| `stackingdao_get_commission_info` | Commission/fee information |
| `stackingdao_get_user_data` | User's stacking position |

**LISA Protocol** (Liquid Stacking)
| Tool | Description |
|------|-------------|
| `lisa_get_balance` | LiSTX balance for an address |
| `lisa_get_total_supply` | Total LiSTX supply |
| `lisa_get_token_uri` | Token metadata URI |

### stacks-sbtc

| Tool | Description |
|------|-------------|
| `sbtc_get_balance` | sBTC balance for an address |
| `sbtc_get_total_supply` | Total sBTC in circulation |
| `sbtc_get_token_uri` | Token metadata URI |
| `sbtc_get_name` | Token name |
| `sbtc_get_symbol` | Token symbol |
| `sbtc_get_decimals` | Token decimals |
| `sbtc_get_contract_info` | Contract deployment info |

### stacks-stacking

| Tool | Description |
|------|-------------|
| `get_pox_info` | Current PoX information |
| `get_pox_cycles` | List PoX cycles |
| `get_pox_cycle` | Specific cycle details |
| `get_pox_cycle_signers` | Signers in a cycle |
| `get_pox_cycle_signer` | Specific signer details |
| `get_pox_cycle_stackers` | Stackers delegating to a signer |
| `get_network_block_times` | Average block times |

## Architecture

```
stacks-mcp/
├── packages/
│   ├── core/                 # Shared: Hiro API client, Clarity helpers
│   ├── mcp-stacks-api/       # Stacks blockchain API server
│   ├── mcp-stacks-defi/      # DeFi protocols server
│   ├── mcp-stacks-sbtc/      # sBTC server
│   └── mcp-stacks-stacking/  # Stacking/PoX server
├── pnpm-workspace.yaml
└── package.json
```

Each MCP server is independently installable and can be used separately.

## Testing

```bash
node test-server.mjs mcp-stacks-api
node test-server.mjs mcp-stacks-defi
node test-server.mjs mcp-stacks-sbtc
node test-server.mjs mcp-stacks-stacking
```

## Tech Stack

- TypeScript + Node.js (ESM)
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) v1.27
- [Stacks.js](https://github.com/hirosystems/stacks.js) libraries
- [Hiro API](https://docs.hiro.so/stacks/api)
- pnpm workspaces + tsup

## License

MIT
