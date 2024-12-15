import {usersCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, WithId} from "mongodb";
import {UserDBType} from "./types/user.db.type";

export const usersRepository = {
    async doesExistById(id: string): Promise<WithId<UserDBType> | null> {
        return await usersCollection.findOne({_id: new ObjectId(id)});
    },
    async create(user: UserDBType): Promise<string> {
        const newUser: InsertOneResult<UserDBType> = await usersCollection.insertOne(user);
        return newUser.insertedId.toString();
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBType> | null> {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});
    },
    async delete(id: string): Promise<DeleteResult> {
        return await usersCollection.deleteOne({_id: new ObjectId(id)});
    },

    // todo выпилить после рефакторинга comments
    async getUser(id: string): Promise<WithId<UserDBType> | null> {
        return await usersCollection.findOne({_id: new ObjectId(id)});
    },
}