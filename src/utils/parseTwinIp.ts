import { Codec } from "@polkadot/types/types";
import hex2a from "./hex2a";

export default function (twin: Codec) {
  const parsedTwin = twin.toJSON();
  parsedTwin["ip"] = hex2a(parsedTwin["ip"]);
  return parsedTwin;
}
