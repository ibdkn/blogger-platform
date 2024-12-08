import {ObjectId} from "mongodb";
import {usersCollection} from "../db/db";
import {usersRepository} from "./users.repository";
import {BlogViewModelType} from "../blogs/blogs.types";
import {UserViewModelType} from "./users.type";

export const usersQueryRepository = {
    async getUsers(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        searchLoginTerm: string | null,
        searchEmailTerm: string | null
    ) {
        const filter: any = {};

        const orConditions = [
            searchLoginTerm && { login: { $regex: searchLoginTerm, $options: 'i' } },
            searchEmailTerm && { email: { $regex: searchEmailTerm, $options: 'i' } }
        ].filter(Boolean);

        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }

        const users = await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 } as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const usersCount = await usersCollection.countDocuments(filter);

        if (!users) {
            return {
                pagesCount: 0,
                page: pageNumber,
                pageSize,
                totalCount: 0,
                items: []
            }
        }

        const transformedUsers = users.map(user => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        }));

        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: usersCount,
            items: transformedUsers
        }
    },
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
}