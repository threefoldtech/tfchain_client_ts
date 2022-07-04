import ClientModel from "@tf-types/clientModel";
import { validateID } from "@utils/index";

export default abstract class Entity {
  createEntity(
    this: ClientModel,
    target: string,
    name: string,
    countryID: string,
    cityID: string,
    signature: string
  ) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfgridModule
        .createEntity(target, name, countryID, cityID, signature)
        .signAndSend(this.key, { nonce });
    });
  }

  updateEntity(
    this: ClientModel,
    name: string,
    countryID: string,
    cityID: string
  ) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfgridModule
        .updateEntity(name, countryID, cityID)
        .signAndSend(this.key, { nonce });
    });
  }

  getEntity(this: ClientModel, id: string) {
    const _id = validateID(id);

    return this.api.query.tfgridModule
      .entities(_id)
      .then((res) => res.toHuman())
      .then((entity) => {
        if (entity["id"] !== _id) throw Error("No such entity");
        return entity;
      });
  }

  getEntityIDByName(this: ClientModel, name: string) {
    return this.api.query.tfgridModule
      .entitiesByNameID(name)
      .then((res) => res.toHuman());
  }

  getEntityIDByPubkey(this: ClientModel, pubkey: string) {
    return this.api.query.tfgridModule
      .entitiesByPubkeyID(pubkey)
      .then((res) => res.toHuman());
  }

  listEntities(this: ClientModel) {
    return this.api.query.tfgridModule.entities.entries().then((entities) => {
      return entities.map(([_, entity]) => entity.toHuman());
    });
  }

  deleteEntity(this: ClientModel) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tfgridModule
        .deleteEntity()
        .signAndSend(this.key, { nonce });
    });
  }
}
