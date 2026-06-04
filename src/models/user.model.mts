import mongodb from "../database/index.mts";
import type { User } from "./types.mts";

async function getUSerByEmail(email: string) {
  const user = await mongodb
    .getDb()
    .collection<User>("users")
    .findOne({ email: email });
  return user;
}
