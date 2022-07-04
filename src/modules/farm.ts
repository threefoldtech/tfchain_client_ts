import ClientModel from "@tf-types/clientModel";
import { validateID } from "@utils/index";

export default abstract class Farm {
  createFarm(
    this: ClientModel,
    name: string,
    certificationType: string,
    publicIPs: number
  ) {
    if (name === "") throw new Error("farm should have a name");
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfgridModule
        .createFarm(name, certificationType, publicIPs)
        .signAndSend(this.key, { nonce });
    });
  }

  getFarm(this: ClientModel, id: string) {
    const _id = validateID(id);
    return this.api.query.tfgridModule
      .farms(_id)
      .then((farm) => farm.toHuman())
      .then((res) => {
        if (res["id"] !== _id) throw Error("No such farm");
        return res;
      });
  }

  deleteFarmIP(this: ClientModel, id: string, ip: string) {
    return this.getFarm(id)
      .then(() => {
        return this.api.rpc.system.accountNextIndex(this.address);
      })
      .then((nonce) => {
        return this.api.tx.tfgridModule
          .removeFarmIp(id, ip)
          .signAndSend(this.key, { nonce });
      });
  }

  listFarms(this: ClientModel) {
    return this.api.query.tfgridModule.farms.entries().then((farms) => {
      return farms.map(([_, farm]) => farm.toHuman());
    });
  }

  deleteFarm(this: ClientModel, id: string) {
    return this.getFarm(id)
      .then(() => {
        return this.api.rpc.system.accountNextIndex(this.address);
      })
      .then((nonce) => {
        return this.api.tx.tfgridModule
          .deleteFarm(id)
          .signAndSend(this.key, { nonce });
      });
  }
}
