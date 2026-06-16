import { Router } from "express";
import productRoutes from "./product.routes.mts";
import userRoutes from "./user.routes.mts";
import newsletterRoutes from "./newsletter.routes.mts";

import swaggerRouter from "./swagger.routes.mts";

const router: Router = Router();

// The home page route
router.get("/", (req, res) => {
    res.json({ title: "API V1" });
});

// load products routes
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/newsletter", newsletterRoutes);

router.use(swaggerRouter);

export default router;
