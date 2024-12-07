import {usersRepository} from "../users/users.repository";

const bcrypt = require('bcrypt');

export const authService = {
    async login(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        let isValidPassword = false;

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