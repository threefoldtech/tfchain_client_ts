import type { AnyJson } from "@polkadot/types/types";
import { ClientModel } from "@tf-types/index";
import { validateID } from "@utils/index";

export default abstract class {
  createNodeContract<T = unknown, H = unknown>(
    this: ClientModel,
    nodeID: number,
    data: T,
    hash: H,
    numberOfPublicIPs: number
  ) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.smartContractModule
        .createNodeContract(nodeID, data, hash, numberOfPublicIPs)
        .signAndSend(this.key, { nonce });
    });
  }

  updateNodeContract<T = unknown, H = unknown>(
    this: ClientModel,
    contractID: number,
    data: T,
    hash: H
  ) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.smartContractModule
        .updateNodeContract(contractID, data, hash)
        .signAndSend(this.key, { nonce });
    });
  }

  createNameContract(this: ClientModel, name: string) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.smartContractModule
        .createNameContract(name)
        .signAndSend(this.key, { nonce });
    });
  }

  createRentContract(this: ClientModel, nodeId: number) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.smartContractModule
        .createRentContract(nodeId)
        .signAndSend(this.key, { nonce });
    });
  }

  cancelContract(this: ClientModel, contractID: number) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.smartContractModule
        .cancelContract(contractID)
        .signAndSend(this.key, { nonce });
    });
  }

  getContract(this: ClientModel, id: string) {
    const _id = validateID(id);
    return this.__getSMObj((sc) => sc.contracts(_id));
  }

  activeRentContractForNode(this: ClientModel, id: string) {
    validateID(id);
    return this.__getSMObj((sc) => sc.activeRentContractForNode(id));
  }

  contractIDByNameRegistration(this: ClientModel, name: string) {
    return this.__getSMObj((sc) => sc.contractIDByNameRegistration(name));
  }

  contractIDByNodeIDAndHash<H = unknown>(
    this: ClientModel,
    nodeID: string,
    hash: H
  ) {
    const _id = validateID(nodeID);
    return this.__getSMObj((sc) => sc.contractIDByNodeIDAndHash(_id, hash));
  }

  nodeContracts(this: ClientModel, id: string, contractState: string) {
    const _id = validateID(id);
    if (!["Created", "Deleted", "OutOfFunds"].includes(contractState))
      throw Error("You must pass a valid contract status");
    return this.__getSMObj((sc) => sc.nodeContracts(_id, contractState));
  }

  private __getSMObj(this: ClientModel, cb: Function): Promise<AnyJson> {
    return cb(this.api.query.smartContractModule).then((res) => res.toJSON());
  }
}
