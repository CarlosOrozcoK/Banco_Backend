import Brand from './brand-model.js';

export const createBrand = async (req, res) => {
    try {
        const { name, image } = req.body;
        const brand = await Brand.create({
            name,
            image,
            status: true
        });

        return res.status(200).json({
            msg: "Marca creada correctamente",
            brandDetails: {
                name: brand.name,
                image: brand.image,
                status: brand.status
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Creación de la marca fallida",
            error: error.message,
        });
    }
};

export const getBrand = async (req, res) => {
    try {
        const brands = await Brand.find({ status: true });

        return res.status(200).json({ success: true, brands });
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener marcas',
            error: e.message
        });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, status } = req.body;

        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            { name, image, status },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            msg: "Marca actualizada correctamente",
            brand: updatedBrand,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar marca",
            error: error.message,
        });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBrand = await Brand.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            msg: "Marca deshabilitada correctamente",
            brand: deletedBrand,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al deshabilitar marca",
            error: error.message,
        });
    }
};
