import SchemeTypes from "./schemeTypes";
import { KeyringPair } from "@polkadot/keyring/types";
import { Keyring, ApiPromise } from "@polkadot/api";
import type {
  Twin,
  Node,
  Balance,
  Contract,
  Farm,
  Sign,
  Entity,
  Voting,
  TfkvStore,
} from "@modules/index";

type Mixins = Twin &
  Node &
  Balance &
  Contract &
  Farm &
  Sign &
  Entity &
  Voting &
  TfkvStore;

export default interface ClientModel extends Mixins {
  url: string;
  words: string;
  scheme: SchemeTypes;
  key: KeyringPair;
  address: string;
  keyring: Keyring;
  api: ApiPromise;
}
