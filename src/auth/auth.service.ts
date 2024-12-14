import {usersRepository} from "../users/users.repository";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";
import bcrypt from "bcrypt";
import {accessTokenType, CustomJwtPayload} from "./auth.type";
import {DomainError} from "../common/types/error.types";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        let isValidPassword: boolean = false;

        if (user) {
            isValidPassword = await bcrypt.compare(password, user.password);
        }

        if (!isValidPassword) {
            throw new DomainError(
                401,
                [{field: 'login or email', message: 'Invalid credentials'}]
            );
        }

        return user;
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
    generateJWT(id: string): accessTokenType {
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '1h'});

        return {
            accessToken: token
        }
    }
}