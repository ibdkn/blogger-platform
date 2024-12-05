import {usersRepository} from "../users/users.repository";

const bcrypt = require('bcrypt');

export const authService = {
    async login(loginOrEmail: string, password: string) {
        console.log(loginOrEmail, password)
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'User not found' }]
            };
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw {
                status: 401,
                errorsMessages: [{ message: 'Invalid credentials' }]
            };
        }
    }
}