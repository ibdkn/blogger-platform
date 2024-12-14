import {body} from "express-validator";

export const passwordValidation = body('password')
    .isString()
    .trim()
    .notEmpty().withMessage('password is required')
    .isLength({min: 6, max: 20}).withMessage('Password must be between 6 and 20 symbols');