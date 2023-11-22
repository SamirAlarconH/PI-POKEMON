const { Pokemon, Type } = require('../db');

const createPokemon = async (req, res) => {
  try {
    const { name, life, attack, defense, speed, height, weight, types } = req.body;

    // Verifica que los campos obligatorios estén presentes
    if (!name || !life || !attack || !defense || !speed || !height || !weight || !types) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Crea el Pokémon en la base de datos
    const newPokemon = await Pokemon.create({
      name,
      life,
      attack,
      defense,
      speed,
      height,
      weight,
    });

    // Asocia los tipos del Pokémon
    await newPokemon.addTypes(types);

    res.status(201).json({ message: "Pokemon creado exitosamente", pokemon: newPokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { createPokemon };