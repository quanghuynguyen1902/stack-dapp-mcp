export type StacksNetwork = "mainnet" | "testnet";

export function getConfig() {
  const network = (process.env.STACKS_NETWORK ?? "mainnet") as StacksNetwork;
  const apiKey = process.env.HIRO_API_KEY;

  const baseUrl =
    network === "mainnet"
      ? "https://api.mainnet.hiro.so"
      : "https://api.testnet.hiro.so";

  return { network, apiKey, baseUrl };
}
