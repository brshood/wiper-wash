/**
 * Removes all documents from WIPER MongoDB collections used by the app.
 * Usage (from web/): node --env-file=.env scripts/zero-database.mjs
 */
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB?.trim() || "wiper";

if (!uri) {
  console.error("Missing MONGODB_URI (use: node --env-file=.env scripts/zero-database.mjs)");
  process.exit(1);
}

const client = new MongoClient(uri, { appName: "wiper-db-zero" });

try {
  await client.connect();
  const db = client.db(dbName);
  await db.command({ ping: 1 });

  const orders = await db.collection("orders").deleteMany({});
  const subs = await db.collection("subscriptions").deleteMany({});

  console.log(`Database: ${dbName}`);
  console.log(`Deleted orders: ${orders.deletedCount}`);
  console.log(`Deleted subscriptions: ${subs.deletedCount}`);
} finally {
  await client.close();
}
