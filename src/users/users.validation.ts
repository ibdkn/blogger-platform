import {body} from 'express-validator';

export const loginValidate = body('login')
    .trim()
    .notEmpty().withMessage('Login is required')
    .isString().withMessage('Login must be a string')
    .isLength({min: 3, max: 10}).withMessage('Login must be between 3 and 10 symbols')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login contains invalid characters');

export const passwordValidate = body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .isLength({min: 6, max: 20}).withMessage('Password must be between 6 and 20 symbols');

export const emailValidate = body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isString().withMessage('Email must be a string')
    .isLength({min: 1, max: 1000}).withMessage('Email must be between 1 and 1000 symbols')
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/).withMessage('Email is invalid');

export const validateUserFields = [
    loginValidate,
    passwordValidate,
    emailValidate
];