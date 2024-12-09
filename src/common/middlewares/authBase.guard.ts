import { Request, Response, NextFunction } from 'express';

export const ADMIN_AUTH = 'admin:qwerty';

export const authBaseGuard = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader: string | undefined = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        const encodedAuth: string = authHeader.slice(6);
        const decodedAuth: string = Buffer.from(encodedAuth, 'base64').toString('utf-8');

        if (decodedAuth === ADMIN_AUTH) {
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
};