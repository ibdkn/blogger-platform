import {usersRepository} from "../users/users.repository";

const bcrypt = require('bcrypt');

export const authService = {
    async login(loginOrEmail, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw {
                status: 404,
                errorsMessages: [{ field: 'login or email', message: 'User not found' }]
            };
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw {
                status: 401,
                errorsMessages: [{  field: 'password', message: 'Invalid credentials' }]
            };
        }
    }
}