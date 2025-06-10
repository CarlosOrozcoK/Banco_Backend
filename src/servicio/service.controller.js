import Service from './service.model.js'


export const createService = async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const service = await Service.create({
            name,
            description,
            category,
            status: true
        });

        return res.status(200).json({
            msg: "Servicio creado correctamente",
            serviceDetails: {
                name: service.name,
                description: service.description,
                category: service.category,
                status: service.status
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Creación del servicio fallida",
            error: error.message,
        });
    }
};


export const getService = async (req, res) => {
    try {
        const services = await Service.find({ status: true });

        return res.status(200).json({ success: true, services });
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener servicios',
            error: e.message
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, status } = req.body;

        const updatedService = await Service.findByIdAndUpdate(
            id,
            { name, description, category, status },
            { new: true }
        );


        return res.status(200).json({
            success: true,
            msg: "Servicio actualizado correctamente",
            service: updatedService,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar servicio",
            error: error.message,
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndUpdate(id, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            msg: "Servicio deshabilitado correctamente",
            service: deletedService,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al deshabilitar servicio",
            error: error.message,
        });
    }
};