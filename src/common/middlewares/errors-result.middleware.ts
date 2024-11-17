import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors
            .array({onlyFirstError: true})
            .map((err) => {
                return {field: (err as any).param, message: err.msg, }
            });
        res.status(400).json({ errorsMessages: formattedErrors });
    }

    next();
};