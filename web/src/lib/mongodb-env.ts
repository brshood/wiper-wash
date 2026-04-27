/**
 * Whether failed MongoDB operations may fall back to in-memory demo data.
 * In production, default is false so misconfiguration surfaces as real errors.
 */
export function allowMongoInMemoryFallback() {
  if (process.env.MONGODB_FALLBACK === "true") return true;
  if (process.env.MONGODB_FALLBACK === "false") return false;
  return process.env.NODE_ENV !== "production";
}
