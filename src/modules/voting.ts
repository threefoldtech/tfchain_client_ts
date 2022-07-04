import ClientModel from "@tf-types/clientModel";

export default abstract class Voting {
  listValidators(this: ClientModel) {
    return this.api.query.tftBridgeModule
      .validators()
      .then((res) => res.toHuman());
  }

  proposeTransaction(
    this: ClientModel,
    transactionID: string,
    to: string,
    amount: number
  ) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      const parsedAmount = this.api.createType("Balance", amount * 1e7);
      return this.api.tx.tftBridgeModule
        .proposeTransaction(transactionID, to, parsedAmount)
        .signAndSend(this.key, { nonce });
    });
  }

  voteTransaction(this: ClientModel, transactionID: string) {
    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.tftBridgeModule
        .voteTransaction(transactionID)
        .signAndSend(this.key, { nonce });
    });
  }
}
