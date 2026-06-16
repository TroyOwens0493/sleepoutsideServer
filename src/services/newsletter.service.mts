import newsletterModel from "../models/newsletter.model.mts";
import { validator } from "./utils.mts";
import { NewsletterSchema } from "../database/json-schema.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

async function subscribe(name: string, email: string) {
  const existing = await newsletterModel.getSubscriberByEmail(email);
  if (existing)
    throw new EntityNotFoundError({
      message: "Email is already subscribed",
      statusCode: 409,
    });

  const newSubscriber = {
    name,
    email,
    createdAt: new Date(),
  };
  validator(NewsletterSchema, newSubscriber);

  return newsletterModel.createSubscriber(newSubscriber);
}

export default {
  subscribe,
};
