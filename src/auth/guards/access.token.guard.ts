import { Response, NextFunction } from 'express';
import {usersRepository} from "../../users/users.repository";
import {jwtService} from "../../common/adapters/jwt.service";
import {HttpStatuses} from "../../common/types/httpStatuses";
import {TokenPayload} from "../types/token.payload.type";
import {UserType} from "../../users/users.type";

export const accessTokenGuard = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(HttpStatuses.Unauthorized).json({ message: 'Authorization header is missing' });
    }

    const [authType, token] = req.headers.authorization.split(" ");

    if (authType !== 'Bearer') {
        return res.status(HttpStatuses.Unauthorized).json({ message: 'Authorization header is missing' });
    }

    const payload: TokenPayload | null = await jwtService.verifyToken(token);

    if (payload) {
        const {userId} = payload;

        const user: UserType | null = await usersRepository.doesExistById(userId);

        if (!user) {
            return res.status(HttpStatuses.Unauthorized).json({ message: 'Invalid token' });
        }
        req.user = {id: userId};

        return next();
    }

    return res.status(HttpStatuses.Unauthorized).json({ message: 'Invalid or expired token' });
};