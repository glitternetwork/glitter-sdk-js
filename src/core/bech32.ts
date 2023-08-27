import { bech32 } from 'bech32';

/** `glitter-` prefixed account address */
export type AccAddress = string;

/** `glittervaloper-` prefixed validator operator address */
export type ValAddress = string;

/** `glittervalcons-` prefixed validator consensus address */
export type ValConsAddress = string;

/** `glitterpub-` prefixed account public key */
export type AccPubKey = string;

/** `glittervaloperpub-` prefixed validator public key */
export type ValPubKey = string;

function checkPrefixAndLength(
  prefix: string,
  data: string,
  length: number
): boolean {
  try {
    const vals = bech32.decode(data);
    return vals.prefix === prefix && data.length == length;
  } catch (e) {
    return false;
  }
}

export namespace AccAddress {
  /**
   * Checks if a string is a valid glitter account address.
   *
   * @param data string to check
   */
  export function validate(data: string): boolean {
    // 44 for normal account and 64 for contract account
    return (
      checkPrefixAndLength('glitter', data, 44) ||
      checkPrefixAndLength('glitter', data, 64)
    );
  }

  /**
   * Converts a validator address into an account address
   *
   * @param address validator address
   */
  export function fromValAddress(address: ValAddress): AccAddress {
    const vals = bech32.decode(address);
    return bech32.encode('glitter', vals.words);
  }
}

export namespace AccPubKey {
  /**
   * Checks if a string is a glitter account's public key
   * @param data string to check
   */

  export function validate(data: string): boolean {
    return checkPrefixAndLength('glitterpub', data, 47);
  }

  /**
   * Converts a glitter validator pubkey to an account pubkey.
   * @param address validator pubkey to convert
   */
  export function fromAccAddress(address: AccAddress): AccPubKey {
    const vals = bech32.decode(address);
    return bech32.encode('glitterpub', vals.words);
  }
}

export namespace ValAddress {
  /**
   * Checks if a string is a glitter validator address.
   *
   * @param data string to check
   */
  export function validate(data: string): boolean {
    return checkPrefixAndLength('glittervaloper', data, 51);
  }

  /**
   * Converts a glitter account address to a validator address.
   * @param address account address to convert
   */
  export function fromAccAddress(address: AccAddress): ValAddress {
    const vals = bech32.decode(address);
    return bech32.encode('glittervaloper', vals.words);
  }
}

export namespace ValPubKey {
  /**
   * Checks if a string is a glitter validator pubkey
   * @param data string to check
   */
  export function validate(data: string): boolean {
    return checkPrefixAndLength('glittervaloperpub', data, 54);
  }

  /**
   * Converts a glitter validator operator address to a validator pubkey.
   * @param valAddress account pubkey
   */
  export function fromValAddress(valAddress: ValAddress): ValPubKey {
    const vals = bech32.decode(valAddress);
    return bech32.encode('glittervaloperpub', vals.words);
  }
}

export namespace ValConsAddress {
  /**
   * Checks if a string is a glitter validator consensus address
   * @param data string to check
   */

  export function validate(data: string): boolean {
    return checkPrefixAndLength('glittervalcons', data, 51);
  }
}
