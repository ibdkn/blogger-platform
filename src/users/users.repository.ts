import {usersCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";
import {UserDBType, UserDBTypeWithConfirm} from "./types/user.db.type";

export const usersRepository = {
    async doesExistById(id: string): Promise<WithId<UserDBType> | null> {
        return await usersCollection.findOne({_id: new ObjectId(id)});
    },
    async doesExistByLoginOrEmail(login: string, email: string): Promise<boolean> {
        const user: UserDBType | null = await usersCollection.findOne({$or: [{email}, {login}]});
        return !!user
    },
    async create(user: UserDBType): Promise<string> {
        const newUser: InsertOneResult<UserDBType> = await usersCollection.insertOne(user);
        return newUser.insertedId.toString();
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});
    },
    async update(user: WithId<UserDBType>): Promise<UpdateResult> {
        return await usersCollection.updateOne({ _id: user._id }, { $set: user });
    },
    async delete(id: string): Promise<DeleteResult> {
        return await usersCollection.deleteOne({_id: new ObjectId(id)});
    },
    async findByConfirmationCode(code: string): Promise<WithId<UserDBTypeWithConfirm> | null> {
        return await usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
    }
}