import ClientModel from "@tf-types/clientModel";
import { Buffer } from "buffer";

export default abstract class {
  signEntityTwinID(this: ClientModel, entityID: string, twinID: string) {
    const _entityId = parseInt(entityID);
    const _twinId = parseInt(twinID);

    if (isNaN(_entityId) || isNaN(_twinId)) {
      throw Error("You must pass an ID");
    }

    return this.getTwin(twinID)
      .then(() => this.getEntity(entityID))
      .then(() => {
        const arr = new ArrayBuffer(4);
        const view = new DataView(arr);
        view.setUint32(0, _entityId, false);

        const arr1 = new ArrayBuffer(4);
        const view1 = new DataView(arr1);
        view1.setUint32(0, _twinId, false);

        const tmp = new Uint8Array(arr.byteLength + arr1.byteLength);
        tmp.set(new Uint8Array(arr), 0);
        tmp.set(new Uint8Array(arr1), arr1.byteLength);

        const message = new Uint8Array(tmp);
        const signedMessage = this.key.sign(message);

        return Buffer.from(signedMessage).toString("hex");
      });
  }

  signEntityCreation(
    this: ClientModel,
    name: string,
    country: string,
    city: string
  ) {
    if (name === "") throw Error("You must pass a valid name");

    const utf8Encode = new TextEncoder();

    const nameAsBytes = utf8Encode.encode(name);
    const countryAsBytes = utf8Encode.encode(country);
    const cityAsBytes = utf8Encode.encode(city);

    const concatArray = new Uint8Array([
      ...nameAsBytes,
      ...countryAsBytes,
      ...cityAsBytes,
    ]);

    const signedMessage = this.key.sign(concatArray);
    return Buffer.from(signedMessage).toString("hex");
  }
}
