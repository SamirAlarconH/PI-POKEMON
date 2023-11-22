const axios = require('axios');
require('dotenv').config();
const { Pokemon, Type } = require('../db');
const { API_KEY } = process.env;

const getPokemonById = async (req, res) => {
  try {
    const pokemonID = parseInt(req.params.id, 10);//Id pokemon por parámetro

    const pokemonsBDD = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ["id"],
        through: {
          attributes: [],
        },
      },
    });

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
    const pokemonAPI = response.data;

    const pokemonsAPI = {
        id: pokemonAPI.id,
        name: pokemonAPI.name,
        image: pokemonAPI.sprites.front_default,
        life: pokemonAPI.stats.find(stat => stat.stat.name === "hp").base_stat,
        attack: pokemonAPI.stats.find(stat => stat.stat.name === "attack").base_stat,
        defense: pokemonAPI.stats.find(stat => stat.stat.name === "defense").base_stat,
        speed: pokemonAPI.stats.find(stat => stat.stat.name === "speed").base_stat,
        height: pokemonAPI.height,
        weight: pokemonAPI.weight,
    }
    const allPokemons = [...pokemonsBDD,pokemonsAPI];

    const pokemon = allPokemons.find((p) => p.id === pokemonID);

    if (pokemon) {
      return res.json(pokemon);
    } else {
      return res.status(404).json({ message: "Pokemon no encontrado" });
    }
  } catch (error) {
     return res.status(500).json({ message: error.message });
  }
}

module.exports = { getPokemonById };