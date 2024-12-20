import {usersRepository} from "../users/users.repository";
import {WithId} from "mongodb";
import {AppError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {jwtService} from "../common/adapters/jwt.service";
import {Result} from "../common/result/result.type";
import {AccessTokenType} from "./types/auth.token.type";
import {UserDBType, UserDBTypeWithConfirm} from "../users/types/user.db.type";
import {nodemailerService} from "../common/adapters/nodemailer.service";
import {emailExamples} from "../common/adapters/emailExpamples";
import {randomUUID} from "node:crypto";
import {isExpirationDatePassed} from "../helpers/date.helper";

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
    async registerUser(
        login: string,
        pass: string,
        email: string
    ): Promise<Result<UserDBType | null>> {
        const user = await usersRepository.doesExistByLoginOrEmail(login, email);

        if (user) {
            throw new AppError(
                ResultStatus.BadRequest,
                'Bad Request',
                [{ field: 'loginOrEmail', message: 'Already Registered' }],
                null
            );
        }

        const passwordHash = await bcryptService.generateHash(pass);
        const confirmationCode = randomUUID();
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours expiration

        const newUser: UserDBTypeWithConfirm = {
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode,
                expirationDate,
                isConfirmed: false
            }
        };

        await usersRepository.create(newUser);

        nodemailerService
            .sendEmail(
                newUser.email,
                newUser.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
            .catch(er => console.error('error in send email:', er));
        return {
            status: ResultStatus.Success,
            data: newUser,
            extensions: [],
        };
    },
    async registrationConfirmation(code: string) {
        const user = await usersRepository.findByConfirmationCode(code);
        if (!user) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not Found',
                [{ message: 'Invalid confirmation code'}],
                null
            );
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new AppError(
                ResultStatus.BadRequest,
                'Bad Request',
                [{ message: 'Email already confirmed'}],
                null
            );
        }

        if (isExpirationDatePassed(user.emailConfirmation.expirationDate)) {
            throw new AppError(
                ResultStatus.BadRequest,
                'Bad Request',
                [{ message: 'Email verification period has expired'}],
                null
            );
        }

        user.emailConfirmation.isConfirmed = true;
        return await usersRepository.update(user);
    },
    async registrationEmailResending(email: string) {
        const user = await usersRepository.findByLoginOrEmail(email);

        if (!user) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not Found',
                [{ message: 'User not found'}],
                null
            );
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new AppError(
                ResultStatus.BadRequest,
                'BadRequest',
                [{ message: 'Email is already confirmed'}],
                null
            );
        }

        nodemailerService
            .sendEmail(
                user.email,
                user.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
            .catch(er => console.error('error in send email:', er));
        return {
            status: ResultStatus.Success,
            data: user,
            extensions: [],
        };
    }
}