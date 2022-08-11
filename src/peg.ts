import { Injectable } from '@nestjs/common';
import { BigNumber, Contract, ethers } from 'ethers';
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from 'ethers/lib/utils';
import { PEG_POOL_ABI } from './abis/peg-pool-abi';
import { awaitTransactionComplete } from './utils';

const PEG_POOL_ADDRESS = '';

@Injectable()
export class PegPool {
  provider: ethers.providers.JsonRpcProvider;
  wallet: ethers.Wallet;
  pegPool: Contract;

  constructor() {
    // const RPC = 'https://bsc-dataseed.binance.org';
    const AVAX_RPC = 'https://api.avax.network/ext/bc/C/rpc';
    this.wallet = new ethers.Wallet(process.env.DEV_KEY);
    this.provider = new ethers.providers.JsonRpcProvider(AVAX_RPC);
    this.wallet = this.wallet.connect(this.provider);
    this.pegPool = new ethers.Contract(
      PEG_POOL_ADDRESS,
      PEG_POOL_ABI,
      this.wallet,
    );
  }

  async run() {
    try {
      const avaxIndex = 0;
      const walrusINdex = 1;
      const tx = await this.pegPool.updateToken(avaxIndex, parseUnits(''));
      await awaitTransactionComplete(tx);

      // const tx = await this.pegPool.rescueToken(
      // '',
      // parseEther(''),
      // '',
      // );
      // await awaitTransactionComplete(tx);
    } catch (error) {
      console.log(error);
    }
  }
}
