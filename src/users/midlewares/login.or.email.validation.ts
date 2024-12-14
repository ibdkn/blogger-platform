import {body} from "express-validator";

export const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .trim()
    .notEmpty().withMessage('loginOrEmail is required')
    .isLength({min: 1, max: 500}).withMessage('LoginOrEmail is not correct');