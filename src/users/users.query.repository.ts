import {ObjectId} from "mongodb";
import {usersCollection} from "../db/db";

export const usersQueryRepository = {
    async createUser(id: string) {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!user) return null;

        // Формируем ViewModel и возвращаем назад в контроллер
        return {
            id: user._id.toString(), // конвертируем _id в id
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    },
    async getUser(id: string) {

    }
}