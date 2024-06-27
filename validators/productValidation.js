const  {body} = require('express-validator');
const validationProducts = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required.please fill the name input'),

    body('description')
    .trim()
    .notEmpty()
    .withMessage('descripiton is required.pleade fill the description file'),
    body('price')
    .trim()
    .notEmpty()
    .withMessage('price is required.please fill the prioe input'),

    body('quantity')
    .trim()
    .notEmpty()
    .withMessage('quantity is required.pleade fill the quantity file'),

    body('shiping')
    .trim()
    .notEmpty()
    .withMessage('shiping is required.please fill the shiping input'),

    body('category')
    .trim()
    .notEmpty()
    .withMessage('category is required.pleade fill the category file'),
    body("image")
    .optional()
    .isString()
    .withMessage('images must be string')
];
module.exports  = {validationProducts}
