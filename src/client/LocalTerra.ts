import { LCDClient } from './lcd/LCDClient';
import { Db } from './lcd/Db';
import { MnemonicKey } from '../key/MnemonicKey';

const LOCALGLITTER_MNEMONICS = {
  validator:
    'satisfy adjust timber high purchase tuition stool faith fine install that you unaware feed domain license impose boss human eager hat rent enjoy dawn',
  test1:
    'lesson police usual earth embrace someone opera season urban produce jealous canyon shrug usage subject cigar imitate hollow route inhale vocal special sun fuel',
  test2:
    'quality vacuum heart guard buzz spike sight swarm shove special gym robust assume sudden deposit grid alcohol choice devote leader tilt noodle tide penalty',
  test3:
    'symbol force gallery make bulk round subway violin worry mixture penalty kingdom boring survey tool fringe patrol sausage hard admit remember broken alien absorb',
  test4:
    'bounce success option birth apple portion aunt rural episode solution hockey pencil lend session cause hedgehog slender journey system canvas decorate razor catch empty',
  test5:
    'second render cat sing soup reward cluster island bench diet lumber grocery repeat balcony perfect diesel stumble piano distance caught occur example ozone loyal',
  test6:
    'spatial forest elevator battle also spoon fun skirt flight initial nasty transfer glory palm drama gossip remove fan joke shove label dune debate quick',
  test7:
    'noble width taxi input there patrol clown public spell aunt wish punch moment will misery eight excess arena pen turtle minimum grain vague inmate',
  test8:
    'cream sport mango believe inhale text fish rely elegant below earth april wall rug ritual blossom cherry detail length blind digital proof identify ride',
  test9:
    'index light average senior silent limit usual local involve delay update rack cause inmate wall render magnet common feature laundry exact casual resource hundred',
  test10:
    'prefer forget visit mistake mixture feel eyebrow autumn shop pair address airport diesel street pass vague innocent poem method awful require hurry unhappy shoulder',
};

export class LocalGlitter extends LCDClient {
  public wallets: {
    validator: Db;
    test1: Db;
    test2: Db;
    test3: Db;
    test4: Db;
    test5: Db;
    test6: Db;
    test7: Db;
    test8: Db;
    test9: Db;
    test10: Db;
  };

  constructor(isClassic?: boolean) {
    super({
      URL: 'http://localhost:1317',
      chainID: 'localglitter',
      isClassic,
    });

    this.wallets = {
      validator: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.validator })
      ),
      test1: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test1 })
      ),
      test2: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test2 })
      ),
      test3: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test3 })
      ),
      test4: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test4 })
      ),
      test5: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test5 })
      ),
      test6: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test6 })
      ),
      test7: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test7 })
      ),
      test8: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test8 })
      ),
      test9: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test9 })
      ),
      test10: this.db(
        new MnemonicKey({ mnemonic: LOCALGLITTER_MNEMONICS.test10 })
      ),
    };
  }
}
