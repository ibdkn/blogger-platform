import {Result, validationResult} from "express-validator";
import { Request, Response, NextFunction } from 'express';

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors: Result = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors
            .array({ onlyFirstError: true })
            .map((err) => ({
                field: (err as any).path,
                message: err.msg,
            }));

        res.status(400).json({ errorsMessages: formattedErrors });
        return;
    }

    next();
};