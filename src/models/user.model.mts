import mongodb from "../database/index.mts";
import type { User } from "./types.mts";

async function getUserByEmail(email: string) {
  const user = await mongodb
    .getDb()
    .collection<User>("users")
    .findOne({ email: email });
  return user;
}

async function createUser(newUser: {
  email: string;
  password: string;
  name: string;
}) {
  const result = await mongodb.getDb().collection("users").insertOne(newUser);
  return result;
}

async function updatePassword(email: string, password: string) {
  const result = await mongodb
    .getDb()
    .collection<User>("users")
    .updateOne(
      { email },
      {
        $set: {
          password,
          modifiedAt: new Date(),
        },
      },
    );
  return result;
}

export default {
  getUserByEmail,
  createUser,
  updatePassword,
};
