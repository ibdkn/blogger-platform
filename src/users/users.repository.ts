import {blogsCollection, usersCollection} from "../db/db";
import {UserType} from "./users.type";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async getUsers() {
        return await usersCollection
            .find({})
            .toArray();
    },
    async getUsersWithPagination(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        filter: any
    ) {
        return await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 } as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async getUsersCount(searchLoginTerm: string | null, searchEmailTerm: string | null) {
        const filter: any = {};

        if (searchLoginTerm) {
            filter.login = {$regex: searchLoginTerm, $options: 'i'}
        }

        if (searchEmailTerm) {
            filter.email = {$regex: searchLoginTerm, $options: 'i'}
        }

        return await usersCollection.countDocuments(filter);
    },
    async getUser(id: string) {
        return await usersCollection
            .findOne({_id: new ObjectId(id)});
    },
    async findUserByLoginOrEmail(loginOrEmail: any) {
        const {login, email} = loginOrEmail;
        return await usersCollection
            .findOne({$or: [{login}, {email}]});
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