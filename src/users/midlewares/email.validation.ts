import {body} from "express-validator";

export const emailValidation = body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isString().withMessage('Email must be a string')
    .isLength({min: 1, max: 1000}).withMessage('Email must be between 1 and 1000 symbols')
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/).withMessage('Email is invalid');