import {body} from "express-validator";

export const contentValidate = body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a string')
    .isLength({min: 20, max: 300}).withMessage('Content must be between 1 and 1000 symbols');