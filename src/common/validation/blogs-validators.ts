import {body} from "express-validator";

export const nameValidate = body('name')
    .isString().withMessage('Name must be a string')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({min: 1, max: 15}).withMessage('Name must be between 1 and 15 symbols');

export const descriptionValidate = body('description')
    .isString().withMessage('Description must be a string')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({min: 1, max: 100}).withMessage('Description must be between 1 and 100 symbols');

export const websiteUrlValidate = body('websiteUrl')
    .isString().withMessage('WebsiteUrl must be a string')
    .trim()
    .notEmpty().withMessage('WebsiteUrl is required')
    .isLength({min: 1, max: 100}).withMessage('WebsiteUrl must be between 1 and 1000 symbols')
    .matches(/^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]+)*\/?$/)
    .withMessage('Website URL is invalid');


export const validateBlogsFields = [
    nameValidate,
    descriptionValidate,
    websiteUrlValidate
];