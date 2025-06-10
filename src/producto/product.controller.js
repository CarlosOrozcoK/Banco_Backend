import Product from './product-model.js'
import {validarJWT} from '../middlewares/validar-jwt.js'

export const createProduct = async (req, res) => {
    try {

        const { name, description, category } = req.body;
        const product = await Product.create({
            name,
            description,
            category,
            status: true
        });

        return res.status(200).json({
            msg: "Producto creado correctamente",
            productDetails: {
                name: product.name,
                description: product.description,
                category: product.category,
                status: product.status
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Creación del producto fallida",
            error: error.message,
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const products = await Product.find({ status: true });

        return res.status(200).json({ success: true, products });
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener productos',
            error: e.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try { 
        const { id } = req.params;
        const { name, description, category, status } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, category, status },
            { new: true }
        );


        return res.status(200).json({
            success: true,
            msg: "Producto actualizado correctamente",
            product: updatedProduct,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar producto",
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            msg: "Producto deshabilitado correctamente",
            product: deletedProduct,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al deshabilitar producto",
            error: error.message,
        });
    }
};