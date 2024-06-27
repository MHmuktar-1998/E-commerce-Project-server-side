const express = require('express');
const { seedController,seedProdect } = require('../controller/user.seedController');

const seedRouter = express.Router();


seedRouter.post('/',seedController);
seedRouter.post('/products',seedProdect);

module.exports = seedRouter;