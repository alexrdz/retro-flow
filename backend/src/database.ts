import { createClient } from "@libsql/client";
import "dotenv/config";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log('All env vars:', Object.keys(process.env));
console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL);
console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN);
console.log('process.env:', process.env);

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("Missing TURSO_DATABASE_URL");
}

if (!url) {
  throw new Error("Missing TURSO_DATABASE_URL");
}

if (!authToken) {
  throw new Error("Missing TURSO_AUTH_TOKEN");
}

export const turso = createClient({
  url,
  authToken
});
