const { Type } = require('../db');

const getTypes = async (req, res) => {
  try {
    const types = await Type.findAll();

    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getTypes };