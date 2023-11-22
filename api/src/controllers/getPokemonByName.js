const axios = require('axios');
require("dotenv").config();
const { Pokemon, Type } = require("../db");

const getPokemonByName = async (req, res) => {
  try {
    const pokemonsBDD = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    const pokemonName = req.params.name.toLowerCase();

    // Consultar datos de la API externa por nombre
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemonAPI = response.data;

    // Mapear datos desde la API externa
    const pokemon = {
      id: pokemonAPI.id,
      name: pokemonAPI.name,
      image: pokemonAPI.sprites.front_default,
      life: pokemonAPI.stats.find(stat => stat.stat.name === "hp").base_stat,
      attack: pokemonAPI.stats.find(stat => stat.stat.name === "attack").base_stat,
      defense: pokemonAPI.stats.find(stat => stat.stat.name === "defense").base_stat,
      speed: pokemonAPI.stats.find(stat => stat.stat.name === "speed").base_stat,
    };

    // Obtener altura y peso desde otro endpoint
    const speciesResponse = await axios.get(pokemonAPI.species.url);
    const speciesData = speciesResponse.data;
    pokemon.height = speciesData.height;
    pokemon.weight = speciesData.weight;

    const allPokemons = [...pokemonsBDD, pokemon];

    const findPokemonName = allPokemons.find((p) => p.name === pokemonName);

    res.json(findPokemonName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getPokemonByName };