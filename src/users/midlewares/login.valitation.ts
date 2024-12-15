import {body} from "express-validator";

export const loginValidation = body('login')
    .trim()
    .notEmpty().withMessage('Login is required')
    .isString().withMessage('Login must be a string')
    .isLength({min: 3, max: 10}).withMessage('Login must be between 3 and 10 symbols')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login contains invalid characters');