import mongodb from "../database/index.mts";
import type { NewsletterSubscriber } from "./types.mts";

async function getSubscriberByEmail(email: string) {
  const subscriber = await mongodb
    .getDb()
    .collection<NewsletterSubscriber>("newsletter")
    .findOne({ email: email });
  return subscriber;
}

async function createSubscriber(newSubscriber: {
  name: string;
  email: string;
  createdAt: Date;
}) {
  const result = await mongodb
    .getDb()
    .collection("newsletter")
    .insertOne(newSubscriber);
  return result;
}

export default {
  getSubscriberByEmail,
  createSubscriber,
};
