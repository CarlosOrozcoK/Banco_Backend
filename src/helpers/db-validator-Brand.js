import Brand from "../Brand/brand.model.js"

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
