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

  /**
   * Gets pool information for the given token pair using FalconHit api
   * @async
   * @param {string} mintA - The mint address of the first token.
   * @param {string} mintB - The mint address of the second token
   * @returns {LiquidityPoolKeys | null} 
   */
  async getPoolInfoByTokenPair(mintA: string, mintB: string) {
    console.log("Falconhit api key", FALCONHIT_API_KEY)
    for (let i = 0; i < 3; i++) {
      try {
        const response = await axios.get(`https://valguibs.com/api/pool/pair/${mintA}/${mintB}`, {
          headers: {
            Authorization: FALCONHIT_API_KEY
          }
        });
        console.log(response.data);
        const poolInfoData: LiquidityPoolKeys = {
          id: new PublicKey(response.data[0].id),
          baseMint: new PublicKey(response.data[0].baseMint),
          quoteMint: new PublicKey(response.data[0].quoteMint),
          lpMint: new PublicKey(response.data[0].lpMint),
          baseDecimals: response.data[0].baseDecimals,
          quoteDecimals: response.data[0].quoteDecimals,
          lpDecimals: response.data[0].lpDecimals,
          version: response.data[0].version,
          programId: new PublicKey(response.data[0].programId),
          authority: new PublicKey(response.data[0].authority),
          openOrders: new PublicKey(response.data[0].openOrders),
          targetOrders: new PublicKey(response.data[0].targetOrders),
          baseVault: new PublicKey(response.data[0].baseVault),
          quoteVault: new PublicKey(response.data[0].quoteVault),
          withdrawQueue: new PublicKey(response.data[0].withdrawQueue),
          lpVault: new PublicKey(response.data[0].lpVault),
          marketVersion: response.data[0].marketVersion,
          marketProgramId: new PublicKey(response.data[0].marketProgramId),
          marketId: new PublicKey(response.data[0].marketId),
          marketAuthority: new PublicKey(response.data[0].marketAuthority),
          marketBaseVault: new PublicKey(response.data[0].marketBaseVault),
          marketQuoteVault: new PublicKey(response.data[0].marketQuoteVault),
          marketBids: new PublicKey(response.data[0].marketBids),
          marketAsks: new PublicKey(response.data[0].marketAsks),
          marketEventQueue: new PublicKey(response.data[0].marketEventQueue),
          lookupTableAccount: response.data[0].lookupTableAccount,
        }
        return poolInfoData as LiquidityPoolKeys;
      } catch (err) {
        await Delay(1000);
        console.error("get Pool info", err);
      }
    }
  }

    /**
   * Retrieves token accounts owned by the wallet.
   * @async
   * @returns {Promise<TokenAccount[]>} An array of token accounts.
   */
    async getOwnerTokenAccounts() {
      const walletTokenAccount = await connection.getTokenAccountsByOwner(this.wallet.publicKey, {
        programId: TOKEN_PROGRAM_ID,
      })
  
      return walletTokenAccount.value.map((i) => ({
        pubkey: i.pubkey,
        programId: i.account.owner,
        accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
      }))
    }

      /**
   * Builds a swap transaction.
   * @async
   * @param {string} toToken - The mint address of the token to receive.
   * @param {number} amount - The amount of the token to swap.
   * @param {LiquidityPoolKeys} poolKeys - The liquidity pool keys.
   * @param {number} [maxLamports=100000] - The maximum lamports to use for transaction fees.
   * @param {boolean} [useVersionedTransaction=true] - Whether to use a versioned transaction.
   * @param {'in' | 'out'} [fixedSide='in'] - The fixed side of the swap ('in' or 'out').
   * @returns {Promise<TransactionInstruction[]>} The constructed swap transaction.
   */

      async getSwapTransaction(
        toToken: string,
        // fromToken: string,
        amount: number,
        poolKeys: LiquidityPoolKeys,
        maxLamports: number = 100000,
        useVersionedTransaction = true,
        fixedSide: 'in' | 'out' = 'in'
      ) {
        const directionIn = poolKeys.quoteMint.toString() == toToken
        const { minAmountOut, amountIn } = await this.calcAmountOut(poolKeys, amount, directionIn)
        // console.log({ minAmountOut, amountIn });
        const userTokenAccounts = await this.getOwnerTokenAccounts()
        const swapTransaction = await Liquidity.makeSwapInstructionSimple({
          connection: connection,
          makeTxVersion: useVersionedTransaction ? 0 : 1,
          poolKeys: {
            ...poolKeys,
          },
          userKeys: {
            tokenAccounts: userTokenAccounts,
            owner: this.wallet.publicKey,
          },
          amountIn: amountIn,
          amountOut: minAmountOut,
          fixedSide: fixedSide,
          config: {
            bypassAssociatedCheck: false,
          },
          computeBudgetConfig: {
            microLamports: maxLamports,
          },
        })
    
        // return swapTransaction.innerTransactions;
        const instructions: TransactionInstruction[] = swapTransaction.innerTransactions[0].instructions.filter(Boolean)
        return instructions as TransactionInstruction[]
      }