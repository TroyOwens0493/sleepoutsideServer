import { Router } from "express";
import productService from "../services/product.service.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { sanitize } from "../services/utils.mts";
const router: Router = Router();

// GET /products/
router.get("/", async (req, res, next) => {
    try {
        const cleanQuery = sanitize(req.query);

        const results = await productService.getAllProducts(cleanQuery);

        if (results.count === 0) {
            return next(
                new EntityNotFoundError({
                    message: "Products Not Found",
                    code: "ERR_NF",
                    statusCode: 404,
                })
            );
        }

        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
});

// GET /products/:id
router.get("/:id", async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return next(new EntityNotFoundError({ message: 'Id required', code: 'ERR_VALID', statusCode: 400 }))
    }
    const product = await productService.getProductById(id);
    if (!product) {
        return next(new EntityNotFoundError({
            message: `Product ${id} Not Found`, code: 'ERR_NF',
            statusCode: 404
        }))
    }
    res.status(200).json(product);

});

export default router; // Export the router to use it in the main file
