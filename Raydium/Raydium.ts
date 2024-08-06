// public module
import { telegram_scraper } from 'telegram-scraper';

// private module
import raydiumToken from "./Raydium/raydium"

import { 
  verifyAddress,
  getRandomArbitrary
}  from "./util/helper";

import {
  solBuyAmountRange
} from "./config";

import { 
  buyActions, 
  sellActions,
  addBuy,
  getSolanaBuys,
  updateSells,
} from './util/db';

import {
  convertAsSignal
} from "./util/helper"

import startRouter from './router/router.start';

// needed types
import {
  signal,
  addressType,
  signalMap
} from "./util/types"

import bot from './bot';

let telegram_signals: signalMap = {};
let telegram_signals_list : number[]  = [];
let totalCnt: number = 0;


export const scrapeMessages = async () => {
  let telegram_channel_username = 'Maestrosdegen';
  let result = JSON.parse(await telegram_scraper(telegram_channel_username));
  let recentMessage = result[result.length-1]["message_text"];
  let spaceNumber = recentMessage.split(" ").length - 1;
  let spacePosition = 0;
  let slashNumber = 0;
  let slashPosition = 0;

  while (spaceNumber > 0) {
    spacePosition = recentMessage.indexOf(" ");
    if (spacePosition >= 40) {
      recentMessage = recentMessage.slice(0, spacePosition + 1);
        break;
    } else {
      recentMessage = recentMessage.slice(spacePosition + 1);
    }
    
    if (recentMessage.search("/") >= 0) {
        slashNumber = recentMessage.split("/").length - 1;
        while (slashNumber >= 0) {
          slashPosition = recentMessage.indexOf("/");
          recentMessage = recentMessage.slice(slashPosition + 1);
          slashNumber--;
        }
    }
    if (recentMessage.includes("?")) {
      let questionNumber = recentMessage.split("?").length - 1;
      while (questionNumber > 0) {
        let questionPosition = recentMessage.indexOf("?");
        recentMessage = recentMessage.slice(0, questionPosition );
        console.log("$$$$$$$$$", recentMessage);
        questionNumber--;
      }
    }

    spaceNumber--;
    const solAmount: number = getRandomArbitrary(solBuyAmountRange[0], solBuyAmountRange[1]);
    if (createSignal(recentMessage, solAmount)) {
      await tokenBuy();
    }
  }

}

export const createSignal = (tokenAddress: string, amount: number ): boolean => {
  const isAddress = verifyAddress(tokenAddress);
  console.log("isAddress", isAddress)
  if (isAddress === addressType.SOLANA) {
    console.log("insert solana signal", tokenAddress);
    telegram_signals[totalCnt] = {
      id: totalCnt,
      contractAddress: tokenAddress,
      action: "buy",
      amount: `${amount} SOL`,
      platform: "raydium",
      chain: "solana",
      timestamp: new Date().toISOString(),
    } as signal;
    telegram_signals_list.push(totalCnt);
    totalCnt = totalCnt + 1;
    return true;
  }
  return false;
}

export const tokenBuy = async () => {
  console.log("staring token buy");
    // while (telegram_signals_list && telegram_signals.length) {
  try {
    /**
     * Check if valid buy signals exist. 
     */
    let telegram_signals_length = telegram_signals_list.length;
    console.log("telegram_signals_list", telegram_signals_list);
    console.log("current telegram signal length", telegram_signals_length);
    for (let i = 0; i < telegram_signals_length; i++) {
      await runTrade(telegram_signals[telegram_signals_list[i]] as signal, i);
    }
    console.log("current signal finished!");
    if (buyActions.length > 0) {
      /**
       * Save successful buying signals to database.
       */
      console.log("buyActions", buyActions);
      const res = await addBuy();
      
      // Remove the signals bought in valid signal group;
      const elementToRemove: number[] = [];
      for (const buyAction of buyActions) {
        elementToRemove.push(buyAction.signalNumber);
        telegram_signals[telegram_signals_list[buyAction.signalNumber]] = null;
      }

      console.log("elementToKeep => ", elementToRemove);
      console.log("before buy telegram_signals_list => ", telegram_signals_list);

      telegram_signals_list = telegram_signals_list.filter((element, index) => !elementToRemove.includes(index));
      
      console.log("current telegram signal length in db", telegram_signals_list.length);

      console.log("after buy telegram_signals_list => ", telegram_signals_list);
      console.log("successfully saved buy siganls!");

      buyActions.length = 0;
    }
  } catch (err) {
    console.log("error", err);
  }
}