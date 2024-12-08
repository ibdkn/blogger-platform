import {usersRepository} from "../users/users.repository";
import {WithId} from "mongodb";
import {UserType} from "../users/users.type";

const bcrypt = require('bcrypt');

export const authService = {
    async login(loginOrEmail: string, password: string): Promise<void> {
        const user: WithId<UserType> | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        let isValidPassword: boolean = false;

        if (user) {
            isValidPassword = await bcrypt.compare(password, user.password);
        }

        if (!isValidPassword) {
            throw {
                status: 401,
                errorsMessages: [{ field: 'login or email', message: 'Invalid credentials' }]
            };
        }
    }
}