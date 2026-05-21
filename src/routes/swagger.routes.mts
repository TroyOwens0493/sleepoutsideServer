import { Router } from "express";
import productService from "../services/product.service.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../swaggerDesign.json" with { type: "json" };

const router: Router = Router();

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
