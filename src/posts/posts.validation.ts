import {body} from 'express-validator';
import {blogsRepository} from "../blogs/blogs.repository";

export const titleValidate = body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({min: 1, max: 30}).withMessage('Title must be between 1 and 30 symbols');

export const shortDescriptionValidate = body('shortDescription')
    .trim()
    .notEmpty().withMessage('ShortDescription is required')
    .isString().withMessage('ShortDescription must be a string')
    .isLength({min: 1, max: 100}).withMessage('ShortDescription must be between 1 and 100 symbols');

export const contentValidate = body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a string')
    .isLength({min: 1, max: 1000}).withMessage('Content must be between 1 and 1000 symbols');

export const blogIdValidate = body('blogId')
    .trim()
    .notEmpty().withMessage('BlogId is required')
    .custom((blogId) => {
        const blogExists = blogsRepository.getBlog(blogId);
        return !!blogExists;
    })
    .withMessage('Blog does not exist');

export const validatePostFields = [
    titleValidate,
    shortDescriptionValidate,
    contentValidate,
    blogIdValidate,
];