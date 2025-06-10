import Service from "../servicio/service.model.js"

export const checkDuplicateService = async (req, res, next) => {
    try {
        const { name, category } = req.body;
        const existingService = await Service.findOne({ name, category });
        if (existingService) {
            return res.status(400).json({
                msg: "Ya existe un servicio con ese nombre"
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al validar servicio duplicado",
            error: error.message,
        })
    }
}