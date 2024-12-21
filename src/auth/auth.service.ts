import {usersRepository} from "../users/users.repository";
import {UpdateResult, WithId} from "mongodb";
import {AppError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {jwtService} from "../common/adapters/jwt.service";
import {ExtensionType, Result} from "../common/result/result.type";
import {AccessTokenType} from "./types/auth.token.type";
import {UserDBType} from "../users/types/user.db.type";
import {nodemailerService} from "../common/adapters/nodemailer.service";
import {emailExamples} from "../common/adapters/emailExpamples";
import {randomUUID} from "node:crypto";
import {isExpirationDatePassed} from "../helpers/date.helper";
import {confirmationService} from "../common/adapters/confirmation.service";

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
    async register(login: string, password: string, email: string): Promise<Result<UserDBType>> {
        const existingUser: WithId<UserDBType> | null = await usersRepository.doesExistByLoginOrEmail(login, email);

        // todo устранить дублирование
        if (existingUser) {
            const errorsMessages: ExtensionType[] = [];

            if (existingUser.login === login) {
                errorsMessages.push({ field: 'login', message: 'Login already exists' });
            }
            if (existingUser.email === email) {
                errorsMessages.push({ field: 'email', message: 'Email already exists' });
            }

            throw new AppError(
                ResultStatus.BadRequest,
                'Bad Request',
                errorsMessages,
                null
            );
        }

        const passwordHash: string = await bcryptService.generateHash(password);
        const confirmationCode: string = randomUUID();
        const expirationDate: string = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const newUser: UserDBType = {
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

        const result: string = await usersRepository.create(newUser);

        if (!result) {
            throw new AppError(
                ResultStatus.BadRequest,
                'Bad Request',
                [{field: 'password', message: 'Failed creating new user'}],
                null
            );
        }

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
    async confirm(code: string):Promise<UpdateResult<UserDBType>> {
        const user: WithId<UserDBType> | null = await usersRepository.findByConfirmationCode(code);

        if (!user) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not Found',
                [{ message: 'Invalid confirmation code', field: 'code'}],
                null
            );
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new AppError(
                ResultStatus.BadRequest,
                'Bad Request',
                [{ message: 'Email is already confirmed', field: 'code'}],
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
    async resendCode(email: string): Promise<Result<WithId<UserDBType>>> {
        const user: WithId<UserDBType> | null = await usersRepository.findByLoginOrEmail(email);

        if (!user) {
            throw new AppError(
                ResultStatus.BadRequest,
                'Bad Request',
                [{ message: 'User with this email not found', field: 'email'}],
                null
            );
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new AppError(
                ResultStatus.BadRequest,
                'Bad Request',
                [{ message: 'Email is already confirmed', field: 'email'}],
                null
            );
        }

        // Получаем сгенерированный код подтверждения и дату его протухания
        const {confirmationCode, expirationDate} = confirmationService.generateConfirmationCode();

        // Обновление данных пользователя с новым кодом подтверждения
        user.emailConfirmation.confirmationCode = confirmationCode;
        user.emailConfirmation.expirationDate = expirationDate;

        await usersRepository.update(user);

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