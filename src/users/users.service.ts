import {usersRepository} from "./users.repository";
import {UserType} from "./users.type";
import bcrypt from 'bcrypt';
import {DeleteResult, InsertOneResult, WithId} from "mongodb";
import {ValidationErrorType} from "../common/types/error.types";

export const usersService = {
    async createUser(dto: Omit<UserType, 'createdAt'>): Promise<string> {
        const {login, password, email} = dto;

        const loginOrEmail: string = login || email

        const existingUser: WithId<UserType> | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail);

        if (existingUser) {
            const errorsMessages: ValidationErrorType[] = [];
            if (existingUser.login === login) {
                errorsMessages.push({ field: 'login', message: 'Login already exists' });
            }
            if (existingUser.email === email) {
                errorsMessages.push({ field: 'email', message: 'Email already exists' });
            }

            throw {status: 400, errorsMessages};
        }

        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        const newUser = {
            login,
            password: hashedPassword,
            email,
            createdAt: new Date().toISOString()
        }

        const result: InsertOneResult<UserType> = await usersRepository.createUser(newUser);

        return result.insertedId.toString();
    },
    async deleteUser(id: string): Promise<DeleteResult> {
        const user: WithId<UserType> | null = await usersRepository.getUser(id);

        if (!user) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'User not found' }]
            };
        }

        return await usersRepository.deleteUser(id);
    }
}