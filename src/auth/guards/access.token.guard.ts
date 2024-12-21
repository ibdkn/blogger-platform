import { Response, NextFunction } from 'express';
import {usersRepository} from "../../users/users.repository";
import {jwtService} from "../../common/adapters/jwt.service";
import {HttpStatuses} from "../../common/types/httpStatuses";
import {TokenPayload} from "../types/token.payload.type";
import {UserDBType} from "../../users/types/user.db.type";

export const accessTokenGuard = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(HttpStatuses.Unauthorized).json({ message: 'Authorization header is missing' });
        return;
    }

    const [authType, token] = req.headers.authorization.split(" ");

    if (authType !== 'Bearer') {
        res.status(HttpStatuses.Unauthorized).json({ message: 'Authorization header is missing' });
        return;
    }

    const payload: TokenPayload | null = await jwtService.verifyToken(token);

    if (payload) {
        const {userId} = payload;

        const user: UserDBType | null = await usersRepository.doesExistById(userId);

        if (!user) {
            res.status(HttpStatuses.Unauthorized).json({ message: 'Invalid token' });
            return;
        }
        req.user = {id: userId};

        return next();
    }

    res.status(HttpStatuses.Unauthorized).json({ message: 'Invalid or expired token' });
    return;
};