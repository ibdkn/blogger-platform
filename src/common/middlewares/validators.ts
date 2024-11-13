import { Request, Response, NextFunction } from 'express';


export const validateCreateBlog = (req: Request, res: Response, next: NextFunction): void => {
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