import { Commitment } from "@solana/web3.js"
import { logger, retrieveEnvVariable } from "../utils"

export const NETWORK = 'mainnet-beta'
export const COMMITMENT_LEVEL: Commitment = retrieveEnvVariable('COMMITMENT_LEVEL', logger) as Commitment
export const RPC_ENDPOINT = retrieveEnvVariable('RPC_ENDPOINT', logger)
export const RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable('RPC_WEBSOCKET_ENDPOINT', logger)
export const LOG_LEVEL = retrieveEnvVariable('LOG_LEVEL', logger)
export const CHECK_IF_MINT_IS_RENOUNCED = retrieveEnvVariable('CHECK_IF_MINT_IS_RENOUNCED', logger) === 'true'
export const USE_SNIPE_LIST = retrieveEnvVariable('USE_SNIPE_LIST', logger) === 'true'
export const SNIPE_LIST_REFRESH_INTERVAL = Number(retrieveEnvVariable('SNIPE_LIST_REFRESH_INTERVAL', logger))
export const MAX_SELL_RETRIES = Number(retrieveEnvVariable('MAX_SELL_RETRIES', logger))
export const PRIVATE_KEY = retrieveEnvVariable('PRIVATE_KEY', logger)
export const QUOTE_MINT = retrieveEnvVariable('QUOTE_MINT', logger)
export const QUOTE_AMOUNT = retrieveEnvVariable('QUOTE_AMOUNT', logger)
export const MIN_POOL_SIZE = retrieveEnvVariable('MIN_POOL_SIZE', logger)
export const MAX_POOL_SIZE = retrieveEnvVariable('MAX_POOL_SIZE', logger)
export const ONE_TOKEN_AT_A_TIME = retrieveEnvVariable('ONE_TOKEN_AT_A_TIME', logger) === 'true'
export const CHECK_IF_MINT_IS_MUTABLE = retrieveEnvVariable('CHECK_IF_MINT_IS_MUTABLE', logger) === 'true'
export const CHECK_IF_MINT_IS_BURNED = retrieveEnvVariable('CHECK_IF_MINT_IS_BURNED', logger) === 'true'
export const JITO_MODE = retrieveEnvVariable('JITO_MODE', logger) === 'true'
export const JITO_ALL = retrieveEnvVariable('JITO_ALL', logger) === 'true'
export const BLOCKENGINE_URL = retrieveEnvVariable('BLOCKENGINE_URL', logger)
export const JITO_AUTH_KEYPAIR = retrieveEnvVariable('JITO_KEY', logger)
export const JITO_FEE = Number(retrieveEnvVariable('JITO_FEE', logger))
export const MAX_BUY_RETRIES =  Number(retrieveEnvVariable('MAX_BUY_RETRIES', logger))
export const PRICE_CHECK_INTERVAL =  Number(retrieveEnvVariable('PRICE_CHECK_INTERVAL', logger))
export const PRICE_CHECK_DURATION =  Number(retrieveEnvVariable('PRICE_CHECK_DURATION', logger))
export const TAKE_PROFIT =  Number(retrieveEnvVariable('TAKE_PROFIT', logger))
export const STOP_LOSS =  Number(retrieveEnvVariable('STOP_LOSS', logger))
export const SELL_SLIPPAGE =  Number(retrieveEnvVariable('SELL_SLIPPAGE', logger))

