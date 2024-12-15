import {usersRepository} from "../users/users.repository";
import {ObjectId, WithId} from "mongodb";
import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";
import { CustomJwtPayload} from "./auth.type";
import {AppError, DomainError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {jwtService} from "../common/adapters/jwt.service";
import {Result} from "../common/result/result.type";
import {AccessTokenType} from "./types/auth.token.type";
import {UserDBType} from "../users/types/user.db.type";

export const authService = {
    async loginUser(loginOrEmail: string, password: string): Promise<Result<AccessTokenType | null>> {
        const result: Result<WithId<UserDBType> | null> = await this.checkUserCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success) {
            throw new AppError(
                ResultStatus.Unauthorized,
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
    async checkUserCredentials(loginOrEmail: string, password: string): Promise<Result<WithId<UserDBType> | null>> {
        const user: WithId<UserDBType> | null = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw new AppError(
                ResultStatus.Unauthorized,
                'Unauthorized',
                [{field: 'loginOrEmail', message: 'Wrong loginOrEmail'}],
                null
            );
        }

        let isPasswordCorrect: boolean = await bcryptService.checkPassword(password, user.passwordHash);

        if (!isPasswordCorrect) {
            throw new AppError(
                ResultStatus.Unauthorized,
                'Unauthorized',
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
}