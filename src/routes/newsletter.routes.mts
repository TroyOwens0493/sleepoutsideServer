import { Router } from "express";
import newsletterService from "../services/newsletter.service.mts";
import { sanitize } from "../services/utils.mts";

const router: Router = Router();

router.post("/", async (req, res, next) => {
  try {
    const cleanBody = sanitize(req.body);
    const { name, email } = cleanBody;

    const result = await newsletterService.subscribe(name, email);
    res.status(201).json({
      message: "Subscribed successfully",
      subscriberId: result.insertedId,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
