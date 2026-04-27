import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment.");
  }

  if (cachedDb) {
    return cachedDb;
  }

  const client = cachedClient ?? new MongoClient(uri);

  if (!cachedClient) {
    await client.connect();
    cachedClient = client;
  }

  cachedDb = client.db("wiper");
  return cachedDb;
}
