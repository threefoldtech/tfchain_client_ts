import { ClientModel } from "@tf-types/index";
import { validateID, hex2a, parseTwinIp } from "@utils/index";

export default abstract class Twin {
  createTwin(this: ClientModel, ip: string) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfgridModule
        .createTwin(ip)
        .signAndSend(this.key, { nonce });
    });
  }

  addTwinEntity(
    this: ClientModel,
    twinID: number,
    entityID: number,
    signature: string
  ) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfgridModule
        .addTwinEntity(twinID, entityID, signature)
        .signAndSend(this.key, { nonce });
    });
  }

  deleteTwinEntity(this: ClientModel, twinID: number, entityID: number) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfgridModule
        .deleteTwinEntity(twinID, entityID)
        .signAndSend(this.key, { nonce });
    });
  }

  getTwin(this: ClientModel, id: string) {
    const _id = validateID(id);
    return this.api.query.tfgridModule
      .twins(_id)
      .then(parseTwinIp)
      .then((res) => {
        if (res["id"] !== id) throw new Error("No such twin");
        res["ip"] = hex2a(res["ip"]);
        return res;
      });
  }

  getTwinIdByAccountId(this: ClientModel, accountId: number) {
    return this.api.query.tfgridModule
      .twinIdByAccountID(accountId)
      .then((res) => res.toJSON())
      .then((twin_id: number) => {
        if (twin_id === 0)
          throw new Error(
            `Couldn't find a twin id for this account id: ${accountId}`
          );
        return twin_id;
      });
  }

  listTwins(this: ClientModel) {
    return this.api.query.tfgridModule.twins.entries().then((twins) => {
      return twins.map(([_, twin]) => parseTwinIp(twin));
    });
  }

  deleteTwin(this: ClientModel, id: string) {
    return this.getTwin(id)
      .then((twin) => {
        if (parseInt(twin["id"]) !== parseInt(id)) {
          throw new Error(`twin with id ${id} does not exist`);
        }
        return this.api.rpc.system.accountNextIndex(this.address);
      })
      .then((nonce) => {
        return this.api.tx.tfgridModule
          .deleteTwin(id)
          .signAndSend(this.key, { nonce });
      });
  }
}
