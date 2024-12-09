import { Response, NextFunction } from 'express';
import {authService} from "../../auth/auth.service";
import {usersRepository} from "../../users/users.repository";


export const authJWTGuard = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header is missing' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }

    try {
        const userId = await authService.getUserIdByToken(token);

        if (userId) {
            req.user = await usersRepository.getUser(userId.toString());
            next();
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};