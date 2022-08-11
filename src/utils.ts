import { BigNumber, ContractTransaction, ethers } from 'ethers';

// Contract storage slots for user balances
// Use to overwrite a users balance to any value for testing
// Removes need for a whole dex and swap setup just for test tokens
export const ASHARE_BALANCES_SLOT = 0;
export const BUSD_BALANCES_SLOT = 1;

export const prepStorageSlotWrite = (
  contractAddress: string,
  storageSlot: number,
) => {
  return ethers.utils.solidityKeccak256(
    ['uint256', 'uint256'],
    [contractAddress, storageSlot], // key, slot - solidity mappings storage = keccak256(mapping key value, value at that key)
  );
};

export const toBytes32 = (bn: BigNumber) => {
  return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
};

export const setStorageAt = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string,
  index: string,
  value: BigNumber,
) => {
  await provider.send('hardhat_setStorageAt', [
    contractAddress,
    index,
    toBytes32(value).toString(),
  ]);
  await provider.send('evm_mine', []); // Just mines to the next block
};

/**
 * Moves the test chain ahead the supplied number of blocks.
 * @param numBlocks
 */
export async function moveUpNumberOfBlocks(
  numBlocks: number,
  provider: ethers.providers.JsonRpcProvider,
) {
  // To base 16 Hex
  await provider.send('hardhat_mine', ['0x' + numBlocks.toString(16)]);
}

export async function awaitTransactionComplete(
  txResponse: ContractTransaction,
  confirmations = 1,
) {
  try {
    console.log(`- Starting transaction: ${txResponse.hash}`);
    console.log(
      `- Awaiting transaction receipt... - ` + new Date().toLocaleString(),
    );
    const txReceipt = await txResponse.wait(confirmations);
    console.log(
      '- TransactionReceipt received - ' + new Date().toLocaleString(),
    );
    if (txReceipt.status === 1) {
      // success
      console.log(`Transaction successful`);
    }
    return txReceipt;
  } catch (error) {
    throw error; // Throw and try to let this be handled back in the call stack as needed
  }
}

export function waitDelay(ms = 5000) {
  console.log(`Awaiting delay of ${ms / 1000} seconds`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms);
  });
}
