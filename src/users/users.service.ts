import {usersRepository} from "./users.repository";
import {DeleteResult, WithId} from "mongodb";
import {AppError} from "../common/types/error.types";
import {CreateUserInputDto} from "./types/create.user.input.dto";
import {ExtensionType} from "../common/result/result.type";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {UserDBType} from "./types/user.db.type";
import {ResultStatus} from "../common/result/resultCode";

export const usersService = {
    async createUser(dto: CreateUserInputDto): Promise<string> {
        const {login, password, email} = dto;
        const loginOrEmail: string = login || email
        const existingUser: WithId<UserDBType> | null = await usersRepository.findByLoginOrEmail(loginOrEmail);

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

        const newUser: UserDBType = {
            login,
            passwordHash,
            email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: '',
                isConfirmed: true,
            }
        }

        return await usersRepository.create(newUser);
    },
    async deleteUser(id: string): Promise<DeleteResult> {
        const user: WithId<UserDBType> | null = await usersRepository.doesExistById(id);

        if (!user) {
            throw new AppError(
                ResultStatus.NotFound,
                'User not found',
                [{ message: 'User not found' }],
                null
            );
        }

        return await usersRepository.delete(id);
    }
}