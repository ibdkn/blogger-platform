import { Request, Response, NextFunction } from 'express';

export const ADMIN_LOGIN = "admin";
export const ADMIN_PASS = "qwerty";
export const ADMIN_TOKEN = 'Basic ' + Buffer.from(`${ADMIN_LOGIN}:${ADMIN_PASS}`).toString('base64');

export const baseAuthGuard = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== ADMIN_TOKEN) {
        res.status(401).json({message: 'Authorization header is missing'});
        return;
    }

    return next();
};