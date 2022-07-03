import ClientModel from "@tf-types/clientModel";
import { hex2a } from "@utils/index";

export default abstract class TfkvStore {
  tfStoreSet(this: ClientModel, key: string, value: string) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfkvStore
        .set(key, value)
        .signAndSend(this.key, { nonce });
    });
  }

  tfStoreGet(this: ClientModel, key: string) {
    return this.api.query.tfkvStore
      .tFKVStore(this.address, key)
      .then((value) => hex2a(value.toString()));
  }

  tfStoreList(this: ClientModel) {
    return this.api.query.tfkvStore.tFKVStore
      .keys(this.address)
      .then((keys) => {
        return keys.map((k) => k.toHuman()[1]);
      });
  }

  tfStoreRemove(this: ClientModel, key: string) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfkvStore.delete(key).signAndSend(this.key, { nonce });
    });
  }
}
