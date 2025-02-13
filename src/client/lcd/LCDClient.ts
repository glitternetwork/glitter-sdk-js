import { APIRequester } from './APIRequester';
import { AuthAPI, TendermintAPI, BankAPI, TxAPI } from './api';
import { Db } from './Db';
import { Numeric } from '../../core/numeric';
import { Coins } from '../../core/Coins';
import { Key } from '../../key';
import { DatasetAPI } from './api/DatasetAPI';

export interface LCDClientConfig {
  /**
   * The base URL to which LCD requests will be made.
   */
  URL: string;

  rpcURL?: string;

  /**
   * Chain ID of the blockchain to connect to.
   */
  chainID: string;

  /**
   * Coins representing the default gas prices to use for fee estimation.
   */
  gasPrices?: Coins.Input;

  /**
   * Number presenting the default gas adjustment value to use for fee estimation.
   */
  gasAdjustment?: Numeric.Input;

  /**
   * is it connected to forked network?
   */
  isClassic?: boolean;
}

const DEFAULT_LCD_OPTIONS: Partial<LCDClientConfig> = {
  gasAdjustment: 1.75,
};

// isClassic network: true
// forked network : false
const DEFAULT_NETWORK_TYPE_BY_CHAIN_ID: { [key: string]: boolean } = {
  default: false,
  'columbus-5': true,
  'bombay-12': true,
  'pisco-1': false,
};

const DEFAULT_GAS_PRICES_BY_CHAIN_ID: { [key: string]: Coins.Input } = {
  default: {
    uluna: 0.15,
  },
  'columbus-5': {
    uusd: 0.15,
  },
  'bombay-12': {
    uusd: 0.15,
  },
  'pisco-1': {
    uluna: 0.15,
  },
};

/**
 * An object repesenting a connection to a glittered node running the Lite Client Daemon (LCD)
 * server, a REST server providing access to a node.
 */

export class LCDClient {
  public config: LCDClientConfig;
  public apiRequester: APIRequester;

  // API access
  public auth: AuthAPI;
  public bank: BankAPI;
  public dataset: DatasetAPI;
  // public distribution: DistributionAPI;
  // public feeGrant: FeeGrantAPI;
  // public gov: GovAPI;
  // public market: MarketAPI;
  // public mint: MintAPI;
  // public authz: AuthzAPI;
  // public oracle: OracleAPI;
  // public slashing: SlashingAPI;
  // public staking: StakingAPI;
  public tendermint: TendermintAPI;
  // public treasury: TreasuryAPI;
  // public wasm: WasmAPI;
  public tx: TxAPI;
  // public ibc: IbcAPI;
  // public ibcTransfer: IbcTransferAPI;
  // public utils: LCDUtils;

  /**
   * Creates a new LCD client with the specified configuration.
   *
   * @param config LCD configuration
   */
  constructor(config: LCDClientConfig) {
    this.config = {
      ...DEFAULT_LCD_OPTIONS,
      gasPrices:
        DEFAULT_GAS_PRICES_BY_CHAIN_ID[config.chainID] ||
        DEFAULT_GAS_PRICES_BY_CHAIN_ID['default'],
      isClassic:
        DEFAULT_NETWORK_TYPE_BY_CHAIN_ID[config.chainID] ||
        DEFAULT_NETWORK_TYPE_BY_CHAIN_ID['default'],
      ...config,
    };

    this.apiRequester = new APIRequester(this.config.URL);

    // instantiate APIs
    this.auth = new AuthAPI(this);
    this.bank = new BankAPI(this);
    this.dataset = new DatasetAPI(this);
    // this.distribution = new DistributionAPI(this);
    // this.feeGrant = new FeeGrantAPI(this);
    // this.gov = new GovAPI(this);
    // this.market = new MarketAPI(this);
    // this.mint = new MintAPI(this);
    // this.authz = new AuthzAPI(this);
    // this.oracle = new OracleAPI(this);
    // this.slashing = new SlashingAPI(this);
    // this.staking = new StakingAPI(this);
    this.tendermint = new TendermintAPI(this);
    // this.treasury = new TreasuryAPI(this);
    // this.wasm = new WasmAPI(this);
    // this.ibc = new IbcAPI(this);
    // this.ibcTransfer = new IbcTransferAPI(this);
    this.tx = new TxAPI(this);
    // this.utils = new LCDUtils(this);
  }

  /** Creates a new Db with the Key. */
  public db(key: Key): Db {
    return new Db(this, key);
  }
}
