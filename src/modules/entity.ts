import ClientModel from "@tf-types/clientModel";
import { validateID, hex2a } from "@utils/index";

export default abstract class {
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
      .then((res) => res.toJSON())
      .then((entity) => {
        if (entity["id"] !== _id) throw Error("No such entity");
        entity["name"] = hex2a(entity["name"]);
        return entity;
      });
  }

  getEntityIDByName(this: ClientModel, name: string) {
    return this.api.query.tfgridModule
      .entitiesByNameID(name)
      .then((res) => res.toJSON());
  }

  getEntityIDByPubkey(this: ClientModel, pubkey: string) {
    return this.api.query.tfgridModule
      .entitiesByPubkeyID(pubkey)
      .then((res) => res.toJSON());
  }

  listEntities(this: ClientModel) {
    return this.api.query.tfgridModule.entities.entries().then((entities) => {
      return entities.map(([_, entity]) => {
        const parsedEntity = entity.toJSON();
        parsedEntity["name"] = hex2a(parsedEntity["name"]);
        return parsedEntity;
      });
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
