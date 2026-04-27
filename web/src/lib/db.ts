import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB?.trim() || "wiper";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb() {
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Set it in .env.local (dev), Vercel env, or Railway variables.",
    );
  }

  if (cachedDb) {
    return cachedDb;
  }

  const client =
    cachedClient ??
    new MongoClient(uri, {
      appName: "wiper-web",
      serverSelectionTimeoutMS: 15_000,
      connectTimeoutMS: 15_000,
    });

  if (!cachedClient) {
    await client.connect();
    cachedClient = client;
  }

  cachedDb = client.db(dbName);
  await cachedDb.command({ ping: 1 });
  return cachedDb;
}
