import { Numeric, Coins } from '../index';

export const chainId = 'glitter_12000-4';
// export const url = 'http://sg5.testnet.glitter.link:41317';
// export const url = 'http://sg5.testnet.glitter.link:46657';
export const url = 'https://orlando-api.glitterprotocol.tech';
export const mnemonicKey =
  'gym panther aware panda result lumber label boring uniform gossip monitor talent direct point provide swim fly unaware clip fossil predict olympic frozen artist';
export const dbName = 'trna';
export const bookTableName = 'news_v1';
export const userTableName = 'user_v3';

// For non-string literals like Coins and Numeric, the type annotations remain.
export const gasPrices: Coins = Coins.fromString('1agli');
export const gasAdjustment: Numeric.Input = Numeric.parse(2.5);
