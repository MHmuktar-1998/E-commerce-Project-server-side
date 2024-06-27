const  {body} = require('express-validator');
const createHttpError = require('http-errors');
const validationCategory = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required.please fill the name input'),
];
module.exports  = {validationCategory}


