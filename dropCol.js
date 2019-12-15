const connection = require("./config/mongoConnections");

async function main() {
  try {
    const db = await connection();
    db.collection("tiers").drop();
    db.serverConfig.close();
  } catch (e) {
    console.log(e);
  }
}

main();
