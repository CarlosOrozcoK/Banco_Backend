import Service from "../servicio/service-model.js"
import Product from "../product/product-model.js"
import Brand from "../Brand/brand-model.js"

export const validarAdminRole = (req, res, next) => {
    const user = req.user || req.usuario;
    if (!user) {
        return res.status(500).json({
            msg: "Error interno: No se validó el token antes de verificar el rol",
        });
    }
    if (user.role !== "ADMIN_ROLE") {
        return res.status(403).json({
            msg: "No tienes permisos para realizar esta acción",
        });
    }
    next();   
};
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
    });
  }
};

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
    });
  }
};

export const checkDuplicateBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({
        msg: "Ya existe una marca con ese nombre",
      });
    }
    next(); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error al validar marca duplicada",
      error: error.message,
    });
  }
};

export const tieneRole = (...roles) => {
  return (req, res, next) => {
    const user = req.user || req.usuario;

    if (!user) {
      return res.status(500).json({
        msg: "No se ha validado el token antes de verificar el rol",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        msg: `El servicio requiere uno de estos roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};