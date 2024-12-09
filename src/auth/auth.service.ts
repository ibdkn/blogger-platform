import {usersRepository} from "../users/users.repository";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";
import bcrypt from "bcrypt";
import {accessTokenType, CustomJwtPayload} from "./auth.type";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        let isValidPassword: boolean = false;

        if (user) {
            isValidPassword = await bcrypt.compare(password, user.password);
            return user;
        }

        if (!isValidPassword) {
            throw {
                status: 401,
                errorsMessages: [{field: 'login or email', message: 'Invalid credentials'}]
            };
        }

        return null;
    },
    async getUserIdByToken(token: string) {
        try {
            const result: CustomJwtPayload = jwt.verify(token, SETTINGS.JWT_SECRET) as CustomJwtPayload;
            return new ObjectId(result.userId)
        } catch (e: any) {
            throw {
                status: 401,
                errorsMessages: [{ field: 'token', message: 'Invalid or expired token' }]
            };
        }
    },
    async getMe(token: string) {
        const userId = await this.getUserIdByToken(token);
        console.log(userId)
        const user = await usersRepository.getUser(userId.toString());

        if (!user) {
            throw {
                status: 404,
                errorsMessages: [{field: 'login or email', message: 'User not found'}]
            };
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