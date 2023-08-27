import { Numeric, Coins } from '../index';

export const chainId = 'glitter_12000-2';
export const url = 'https://api.xian.glitter.link';
export const mnemonicKey =
  'lesson police usual earth embrace someone opera season urban produce jealous canyon shrug usage subject cigar imitate hollow route inhale vocal special sun fuel';
export const dbName = 'database_test';
export const bookTableName = 'book_v3';
export const userTableName = 'user_v3';

// For non-string literals like Coins and Numeric, the type annotations remain.
export const gasPrices: Coins = Coins.fromString('1agli');
export const gasAdjustment: Numeric.Input = Numeric.parse(2.5);
