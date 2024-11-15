import { Request, Response, NextFunction } from 'express';
import {blogsRepository} from "../../blogs/blogs.repository";

export const validateBlogFields = (req: Request, res: Response, next: NextFunction): void => {
    const { name, description, websiteUrl } = req.body;

    const errors: { field: string; message: string }[] = [];

    // Проверка имени
    if (!name || name.trim().length === 0 || name.trim().length > 15) {
        errors.push({ field: 'name', message: 'Name is required and must be between 1 and 15 symbols' });
    }

    // Проверка описания
    if (!description || description.trim().length === 0 || description.trim().length > 100) {
        errors.push({ field: 'description', message: 'Description is required and must be between 1 and 100 symbols' });
    }

    // Проверка URL
    const pattern = /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9._-]+)*\/?$/;
    if (!websiteUrl || websiteUrl.trim().length === 0 || websiteUrl.trim().length > 100 || !pattern.test(websiteUrl)) {
        errors.push({ field: 'websiteUrl', message: 'Website URL is invalid, missing, or must be between 1 and 100 symbols' });
    }

    // Если есть ошибки, возвращаем ответ с кодом 400
    if (errors.length > 0) {
        res.status(400).json({ errorsMessages: errors });
    }

    // Если ошибок нет, продолжаем выполнение
    next();
};
export const validatePostFields = (req: Request, res: Response, next: NextFunction): void => {
    const { title, shortDescription, content, blogId } = req.body;

    const errors: { field: string; message: string }[] = [];

    // Проверка имени
    if (!title || title.trim().length === 0 || title.trim().length > 30) {
        errors.push({ field: 'title', message: 'Title is required and must be between 1 and 30 symbols' });
    }

    // Проверка описания
    if (!shortDescription || shortDescription.trim().length === 0 || shortDescription.trim().length > 100) {
        errors.push({ field: 'shortDescription', message: 'ShortDescription is required and must be between 1 and 100 symbols' });
    }

    // Проверка содержания
    if (!content || content.trim().length === 0 || content.trim().length > 1000) {
        errors.push({ field: 'content', message: 'Content is required and must be between 1 and 1000 symbols' });
    }

    // Проверка id блога
    if (!blogId || blogId.trim().length === 0) {
        errors.push({ field: 'blogId', message: 'BlogId is required' });
    }

    // Проверка на существущий blogId
    if (!blogId || !blogsRepository.getBlog(blogId)) {
        errors.push({ field: 'blogId', message: 'Invalid blogId or blog does not exist' });
    }

    // Если есть ошибки, возвращаем ответ с кодом 400
    if (errors.length > 0) {
        res.status(400).json({ errorsMessages: errors });
    }

    // Если ошибок нет, продолжаем выполнение
    next();
};
