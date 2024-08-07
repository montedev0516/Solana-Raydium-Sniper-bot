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




}



