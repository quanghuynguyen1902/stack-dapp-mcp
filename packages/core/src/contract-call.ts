import { hiroPost } from "./hiro-client.js";
import {
  cvToJSON,
  hexToCV,
  serializeCV,
  uintCV,
  principalCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  boolCV,
  noneCV,
  someCV,
  listCV,
  tupleCV,
  type ClarityValue,
} from "@stacks/transactions";

export interface ContractCallResult {
  okay: boolean;
  result: string;
}

/**
 * Call a read-only function on a Stacks smart contract.
 */
export async function callReadOnly(
  contractAddress: string,
  contractName: string,
  functionName: string,
  args: ClarityValue[] = [],
  senderAddress: string = contractAddress,
): Promise<unknown> {
  const path = `/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
  const serializedArgs = args.map(
    (arg) => `0x${Buffer.from(serializeCV(arg)).toString("hex")}`,
  );

  const result = await hiroPost<ContractCallResult>(path, {
    sender: senderAddress,
    arguments: serializedArgs,
  });

  if (!result.okay) {
    throw new Error(`Contract call failed: ${result.result}`);
  }

  const clarityValue = hexToCV(result.result);
  return cvToJSON(clarityValue);
}

/**
 * Helpers for building Clarity values to pass as arguments.
 */
export const clarityValues: {
  uint: typeof uintCV;
  principal: typeof principalCV;
  buffer: typeof bufferCV;
  stringAscii: typeof stringAsciiCV;
  stringUtf8: typeof stringUtf8CV;
  bool: typeof boolCV;
  none: typeof noneCV;
  some: typeof someCV;
  list: typeof listCV;
  tuple: typeof tupleCV;
} = {
  uint: uintCV,
  principal: principalCV,
  buffer: bufferCV,
  stringAscii: stringAsciiCV,
  stringUtf8: stringUtf8CV,
  bool: boolCV,
  none: noneCV,
  some: someCV,
  list: listCV,
  tuple: tupleCV,
};

// Re-export as cv for convenience
export { clarityValues as cv };
