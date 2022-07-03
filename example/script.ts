import Client from "../src/client";

async function main() {
  const c = new Client(
    "wss://tfchain.dev.grid.tf",
    "guilt leaf sure wheel shield broom retreat zone stove cycle candy nation"
  );

  await c.init();

  log(`Listing Nodes`, await c.listNodes());
  log(`Listing Farms`, await c.listFarms());
  log(`Listing Twins`, await c.listTwins());
  log(`Listing Entities`, await c.listEntities());
  log(`Listing Validators`, await c.listValidators());
}

function log(name: string, value: []): void {
  console.log(`%c[+] ${name}`, "color: #bada55");
  console.log(value);
}

main();
