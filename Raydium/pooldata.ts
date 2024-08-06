import {  
    PublicKey, 
    Keypair, 
    VersionedTransaction, 
    TransactionMessage, 
    TransactionInstruction,
  } from '@solana/web3.js';
  import {
    Liquidity,
    LiquidityPoolKeys,
    Token,
    TokenAmount,
    TOKEN_PROGRAM_ID,
    Percent,
    SPL_ACCOUNT_LAYOUT,
  } from '@raydium-io/raydium-sdk';
  import axios from "axios"
  import { Wallet } from '@coral-xyz/anchor';
  import bs58 from 'bs58'
  import dotenv from "dotenv";
  dotenv.config();

  const FALCONHIT_API_KEY = process.env.FALCONHIT_API_KEY

import { connection } from '../config';  
import { Delay } from '../util/helper';
import { poolInfoDataType } from '../util/types';
/**
 * Class representing a Raydium Swap operation.
 */
class RaydiumSwap {
  wallet: Wallet
   /**
   * Create a RaydiumSwap instance.
   * @param {string} WALLET_PRIVATE_KEY - The private key of the wallet in base58 format.
   */
  constructor(WALLET_PRIVATE_KEY: string) {
    this.wallet = new Wallet(Keypair.fromSecretKey(Uint8Array.from(bs58.decode(WALLET_PRIVATE_KEY))))
    console.log("wallet", this.wallet.publicKey);
    this.wallet.payer
  }
  