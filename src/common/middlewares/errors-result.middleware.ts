import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors
            .array({onlyFirstError: true})
            .map((err) => {
                return {message: err.msg, field: (err as any).param}
            });
        res.status(400).json({ errorsMessages: formattedErrors });
    }

    next();
};