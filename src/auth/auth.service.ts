import {usersRepository} from "../users/users.repository";

const bcrypt = require('bcrypt');

export const authService = {
    async login(loginOrEmail: any, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);

        if (!user || await bcrypt.compare(password, user.password)) {
            throw {
                status: 401,
                errorsMessages: [{ field: 'login or email', message: 'Invalid credentials' }]
            };
        }
    }
}