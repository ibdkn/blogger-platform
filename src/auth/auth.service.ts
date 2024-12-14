import {usersRepository} from "../users/users.repository";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";
import {AccessTokenType, CustomJwtPayload} from "./auth.type";
import {AppError, DomainError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {jwtService} from "../common/adapters/jwt.service";
import {HttpStatuses} from "../common/types/httpStatuses";

export const authService = {
    async loginUser(loginOrEmail: string, password: string) {
        const result = await this.checkUserCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success) {
            throw new AppError(
                HttpStatuses.Unauthorized,
                ResultStatus.Unauthorized,
                [{ field: 'password', message: 'Wrong password' }],
                null
            );
        }

        const accessToken: string = await jwtService.createToken(result.data!._id.toString());

        return {
            status: ResultStatus.Success,
            data: {accessToken},
            extensions: []
        }
    },
    async checkUserCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw new AppError(
                HttpStatuses.NotFound,
                ResultStatus.NotFound,
                [{field: 'loginOrEmail', message: 'Not Found'}],
                null
            );
        }

        // todo изменить тип на hashPassword
        let isPasswordCorrect = await bcryptService.checkPassword(password, user.password);

        if (!isPasswordCorrect) {
            throw new AppError(
                HttpStatuses.BadRequest,
                ResultStatus.BadRequest,
                [{field: 'password', message: 'Wrong password'}],
                null
            );
        }

        return {
            status: ResultStatus.Success,
            data: user,
            extensions: []
        };
    },
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
    },
    async getMe(token: string) {
        const userId = await this.getUserIdByToken(token);
        const user = await usersRepository.getUser(userId.toString());

        if (!user) {
            throw new DomainError(
                404,
                [{field: 'login or email', message: 'User not found'}]
            );
        }

        return {
            email: user.email,
            login: user.login,
            userId: userId
        }
    },
}