import {usersRepository} from "./users.repository";
import {UserType} from "./users.type";

const bcrypt = require('bcrypt');

export const usersService = {
    async getUsers() {
        return usersRepository.getUsers();
    },
    async getUser(id: string) {
        const user = await usersRepository.getUser(id);

        if (!user) return null;

        return user._id.toString();
    },
    async createUser(dto: Omit<UserType, 'createdAt'>) {
        const {login, password, email} = dto;

        // Хэшируем пароль перед сохранением
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            login,
            password: hashedPassword,
            email,
            createdAt: new Date().toISOString()
        }

        // Создаем пользователя
        const result = await usersRepository.createUser(newUser);

        // Возвращаем _id созданного пользователя
        return result.insertedId.toString();
    },
    async deleteUser(id: string) {
        const user = await usersRepository.getUser(id);

        if (!user) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'User not found' }]
            };
        }

        return await usersRepository.deleteUser(id);
    }
}