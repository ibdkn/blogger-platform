import {usersRepository} from "../users/users.repository";
import {ObjectId, WithId} from "mongodb";
import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";
import { CustomJwtPayload} from "./auth.type";
import {AppError, DomainError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {jwtService} from "../common/adapters/jwt.service";
import {HttpStatuses} from "../common/types/httpStatuses";
import {Result} from "../common/result/result.type";
import {AccessTokenType} from "./types/auth.token.type";
import {UserType} from "../users/users.type";

export const authService = {
    async loginUser(loginOrEmail: string, password: string): Promise<Result<AccessTokenType | null>> {
        const result: Result<WithId<UserType> | null> = await this.checkUserCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success) {
            throw new AppError(
                HttpStatuses.Unauthorized,
                'Unauthorized',
                [{ field: 'password', message: 'Wrong password' }],
                null
            );
        }

        const accessToken: string = await jwtService.createToken(result.data!._id.toString());

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: {accessToken},
        }
    },
    async checkUserCredentials(loginOrEmail: string, password: string): Promise<Result<WithId<UserType> | null>> {
        const user: WithId<UserType> | null = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw new AppError(
                HttpStatuses.NotFound,
                'Not Found',
                [{field: 'loginOrEmail', message: 'Not Found'}],
                null
            );
        }

        // todo изменить тип на hashPassword
        let isPasswordCorrect: boolean = await bcryptService.checkPassword(password, user.password);

        if (!isPasswordCorrect) {
            throw new AppError(
                HttpStatuses.BadRequest,
                'Bad Request',
                [{field: 'password', message: 'Wrong password'}],
                null
            );
        }

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: user
        };
    },
    // todo выпилить потом + удалить auth.type.ts
    async getUserIdByToken(token: string) {
        try {
            const result: CustomJwtPayload = jwt.verify(token, SETTINGS.JWT_SECRET) as CustomJwtPayload;
            return new ObjectId(result.userId)
        } catch (e: any) {
            throw new DomainError(
                401,
                [{ field: 'token', message: 'Invalid or expired token' }]
            );
        }
    }
}