import {usersCollection} from "../db/db";
import {UserType} from "./users.type";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async getUsers() {
        return await usersCollection
            .find({})
            .toArray();
    },
    async getUser(id: string) {
        return await usersCollection
            .findOne({_id: new ObjectId(id)});
    },
    async findUserByLoginOrEmail(loginOrEmail: string) {
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