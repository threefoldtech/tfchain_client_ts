import ClientModel from "@tf-types/clientModel";
import { validateID, hex2a } from "@utils/index";

export default abstract class Node {
  createNode(
    this: ClientModel,
    farmID: string,
    resources: unknown,
    location: unknown,
    countryID: string,
    cityID: string,
    publicConfig: unknown
  ) {
    return this.getFarm(farmID)
      .then(() => this.api.rpc.system.accountNextIndex(this.address))
      .then((nonce) => {
        return this.api.tx.tfgridModule
          .createNode(
            farmID,
            this.api.createType("Resources" as any, resources),
            this.api.createType("Location" as any, location),
            countryID,
            cityID,
            this.api.createType("PublicConfig" as any, publicConfig)
          )
          .signAndSend(this.key, { nonce });
      });
  }

  updateNode(
    this: ClientModel,
    nodeID: string,
    farmID: string,
    resources: unknown,
    location: unknown,
    countryID: string,
    cityID: string,
    publicConfig: string
  ) {
    return this.getNode(nodeID)
      .then(() => this.getFarm(farmID))
      .then(() => this.api.rpc.system.accountNextIndex(this.address))
      .then((nonce) => {
        return this.api.tx.tfgridModule
          .updateNode(
            farmID,
            this.api.createType("Resources" as any, resources),
            this.api.createType("Location" as any, location),
            countryID,
            cityID,
            this.api.createType("PublicConfig" as any, publicConfig)
          )
          .signAndSend(this.key, { nonce });
      });
  }

  getNode(this: ClientModel, id: string) {
    let _id = validateID(id);
    return this.api.query.tfgridModule
      .nodes(_id)
      .then((res) => res.toJSON())
      .then((node) => {
        if (node["id"] !== _id) throw Error("No such node");

        const location = node["location"];
        const { longitude = "", latitude = "" } = location;
        location["longitude"] = hex2a(longitude);
        location["latitude"] = hex2a(latitude);

        const publicConfig = node["public_config"];
        if (publicConfig) {
          const { ipv4, ipv6, gw4, gw6 } = publicConfig;
          publicConfig.ipv4 = hex2a(ipv4);
          publicConfig.ipv6 = hex2a(ipv6);
          publicConfig.gw4 = hex2a(gw4);
          publicConfig.gw6 = hex2a(gw6);
        }

        return node;
      });
  }

  getNodeIDByPubkey(this: ClientModel, pubkey: string) {
    return this.api.query.tfgridModule
      .nodesByPubkeyID(pubkey)
      .then((res) => res.toJSON());
  }

  listNodes(this: ClientModel) {
    return this.api.query.tfgridModule.nodes.entries().then((nodes) => {
      return nodes.map(([_, node]) => node.toJSON());
    });
  }

  deleteNode(this: ClientModel, id: string) {
    return this.getNode(id)
      .then(() => this.api.rpc.system.accountNextIndex(this.address))
      .then((nonce) => {
        return this.api.tx.tfgridModule
          .deleteNode(id)
          .signAndSend(this.key, { nonce });
      });
  }
}
