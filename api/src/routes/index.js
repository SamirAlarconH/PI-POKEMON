const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { getPokemonById} = require("../controllers/getPokemonById");
const { getAllPokemons } = require('../controllers/getAllPokemons');
const { getPokemonByName } = require('../controllers/getPokemonByName');
const { createPokemon } = require('../controllers/createPokemon');
const { getTypes } = require('../controllers/getTypes');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/pokemon/all", getAllPokemons);
router.get("/pokemon/name/:name", getPokemonByName);
router.get("/pokemon/:id", getPokemonById);
router.post('/pokemon/create', createPokemon);
router.get('/types', getTypes);

module.exports = router;
