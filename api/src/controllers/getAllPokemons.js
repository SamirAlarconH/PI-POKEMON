const axios = require('axios');
require('dotenv').config();
const { Pokemon, Type } = require('../db');
const { API_KEY } = process.env;

const getAllPokemons = async (req, res) => {
  try {
    const pageSize = 12;
    const currentPage = req.query.page || 1;

    const offset = (currentPage - 1) * pageSize;

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`);
    const pokemonListAPI = response.data.results;
    // Obtener todos los Pokémon de la base de datos local
    const pokemonsBDD = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ["id"],
        through: {
          attributes: [],
        },
      },
    });

    // Obtener la lista de todos los Pokémon de la API externa

    // Mapear la lista de Pokémon de la API para obtener detalles adicionales si es necesario
    const pokemonsAPI = await Promise.all(
      pokemonListAPI.map(async (pokemon) => {
        const detailedResponse = await axios.get(pokemon.url);
        const detailedPokemon = detailedResponse.data;

        return {
          id: detailedPokemon.id,
          name: detailedPokemon.name,
          image: detailedPokemon.sprites.front_default,
          life: detailedPokemon.stats.find(stat => stat.stat.name === "hp").base_stat,
          attack: detailedPokemon.stats.find(stat => stat.stat.name === "attack").base_stat,
          defense: detailedPokemon.stats.find(stat => stat.stat.name === "defense").base_stat,
          speed: detailedPokemon.stats.find(stat => stat.stat.name === "speed").base_stat,
          height: detailedPokemon.height,
          weight: detailedPokemon.weight,
        };
      })
    );

    // Combinar datos de la base de datos y la API
    const allPokemons = [...pokemonsBDD, ...pokemonsAPI];

    res.json(allPokemons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getAllPokemons };