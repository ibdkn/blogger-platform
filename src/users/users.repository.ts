import {usersCollection} from "../db/db";
import {UserType} from "./users.type";
import {ObjectId, WithId} from "mongodb";

export const usersRepository = {
    async getUser(id: string): Promise<WithId<UserType> | null> {
        return await usersCollection
            .findOne({_id: new ObjectId(id)});
    },
    async doesExistById(id: string) {
        return await usersCollection
            .findOne({_id: new ObjectId(id)});
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserType> | null> {
        return await usersCollection
            .findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});
    },
    async createUser(user: UserType) {
        return await usersCollection
            .insertOne(user);
    },
    async deleteUser(id: string) {
        return await usersCollection
            .deleteOne({_id: new ObjectId(id)});
    }
}