import ClientModel from "@tf-types/clientModel";

export default abstract class Balance {
  getBalance(this: ClientModel, address: string) {
    return this.api.query.system
      .account(address)
      .then((res) => res["data"])
      .then((balance) => {
        return {
          free: balance.free.toHuman(),
          reserved: balance.reserved.toHuman(),
          miscFrozen: balance.miscFrozen.toHuman(),
          feeFrozen: balance.feeFrozen.toHuman(),
        };
      });
  }

  transfer(this: ClientModel, address: string, amount: number) {
    if (isNaN(amount) || amount === 0)
      throw Error("You must pass a valid numeric amount");

    return this.api.rpc.system.accountNextIndex(this.address).then((nonce) => {
      return this.api.tx.balances
        .transfer(address, amount)
        .signAndSend(this.key, { nonce });
    });
  }
}
