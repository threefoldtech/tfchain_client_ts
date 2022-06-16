export default function (id: string): number | never {
  let _id = parseInt(id);
  if (isNaN(_id) || _id === 0) {
    throw Error("You must pass a valid ID");
  }
  return _id;
}
