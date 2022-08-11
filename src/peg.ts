import { Injectable } from '@nestjs/common';
import { BigNumber, Contract, ethers } from 'ethers';
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from 'ethers/lib/utils';
import { PEG_POOL_ABI } from './abis/peg-pool-abi';

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
    //  this.watchEvents();

    // //  = 0, Ashare = 1
    // const tokenIndex = 0;
    // const perBlock: BigNumber = (await this.pegPool.rewardTokens(tokenIndex))
    //   .rewardPerBlock;
    // console.log(formatEther(perBlock));

    const user = '0xfe499A8B3a53A6090f75d8F503117a6FEF0FcbAA';
    const info = await this.pegPool.userInfo(user);
    console.log(formatUnits(info, 6));

    // const totalDeposits = await this.pegPool.totalDepositTokenAmount();
    // console.log(formatUnits(totalDeposits, 6));

    // const poolsAccum = await this.pegPool.poolAccForToken(
    //   '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    // );
    // console.log(poolsAccum);
    // const acc2 = await this.pegPool.poolAccForToken(
    //   '0xe6d1aFea0B76C8f51024683DD27FA446dDAF34B6',
    // );
    // console.log(formatEther(acc2));

    const pending = await this.pegPool.pendingRewards(user);
    console.log(pending[1]);
    pending[1].forEach((r) => {
      console.log(formatEther(r));
    });

    // const newPerDay = perBlock.mul(blocksPerDay).sub(parseEther('40'));
    // console.log(formatEther(newPerDay));
    // const newPerBlock = newPerDay.div(blocksPerDay);
    // console.log(formatEther(newPerBlock));
    // const tx = await this.pegPool.updateToken(tokenIndex, newPerBlock);
    // await awaitTransactionComplete(tx);
    // console.log(
    //   formatEther((await this.pegPool.rewardTokens(tokenIndex)).rewardPerBlock),
    // );

    // const tx = await this.pegPool.pullStuckToken(
    //   AMES_ADDRESS,
    //   parseEther(''),
    //   '',
    // );
    // await awaitTransactionComplete(tx);
  }

  watchEvents() {
    console.log('Listening for events..');
    this.pegPool.on('FarmHarvest', (amt) => {
      console.log('FarmHarvest: ' + formatEther(amt));
    });

    this.pegPool.on('Withdraw', (who, amt) => {
      console.log('User Withdraw event');
      console.log(`
      who: ${who}, amount: ${formatEther(amt)}`);
    });
  }
}
