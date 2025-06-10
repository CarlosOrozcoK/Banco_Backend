import Product from "../producto/product.model.js"

export const checkDuplicateProduct = async (req, res, next) => {
    try {
        const { name, category, description } = req.body;
        const existingProduct = await Product.findOne({ name, category, description });
        if (existingProduct) {
            return res.status(400).json({
                msg: "Ya existe un producto con ese nombre, categoría y descripción",
            });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al validar producto duplicado",
            error: error.message,
        })
    }
}