import {body} from "express-validator";

export const nameValidator = body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ max: 15 }).withMessage('Name must be at most 15 symbols');

export const websiteUrlValidator = body('websiteUrl')
    .trim()
    .notEmpty().withMessage('Website URL is required')
    .isString().withMessage('Website URL must be a string')
    .isLength({ max: 100 }).withMessage('Website URL must be at most 100 symbols')
    .matches(/^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]+)*\/?$/).withMessage('Website URL is invalid');

export const descriptionValidator = body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ max: 100 }).withMessage('Description must be at most 100 symbols');

export const blogFieldsValidation = [
    nameValidator,
    websiteUrlValidator,
    descriptionValidator
];