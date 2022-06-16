import "@polkadot/api-augment";
import { Mixin } from "ts-mixer";
import {
  Node,
  Farm,
  Balance,
  Twin,
  Contract,
  Sign,
  Entity,
  Voting,
  TfkvStore,
} from "@modules/index";
import { SchemeTypes } from "@tf-types/index";
import { WsProvider, ApiPromise, Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import crypto from "@polkadot/util-crypto";
import bip39 from "bip39";
import types from "./types.json";

export default class Client extends Mixin(
  Node,
  Farm,
  Balance,
  Twin,
  Contract,
  Sign,
  Entity,
  Voting,
  TfkvStore
) {
  public key: KeyringPair;
  public address: string;
  public api: ApiPromise;
  public keyring: Keyring;

  constructor(
    public url: string,
    public words: string,
    public scheme: SchemeTypes = SchemeTypes.sr25519
  ) {
    super();
  }

  async init() {
    const provider = new WsProvider(this.url || "ws://localhost:9944");
    this.api = await ApiPromise.create({ provider, types });

    const keyring = new Keyring({ type: this.scheme });

    if (!this.words) {
      this.words = crypto.mnemonicGenerate();
    }

    try {
      this.key = keyring.addFromUri(this.words);
    } catch {
      if (!bip39.validateMnemonic(this.words)) {
        throw Error("Invalid mnemonic! Must be bip39 compliant");
      }

      try {
        this.key = keyring.addFromMnemonic(this.words);
      } catch {
        throw Error("Invalid mnemonic or secret seed! Check your input.");
      }
    }

    console.log(`Key with address: ${this.key.address} is loaded.`);
    this.keyring = keyring;
    this.address = this.key.address;
  }
}
