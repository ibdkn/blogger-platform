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

        // todo сработает ли одновременно или перезапишется ?
        if (searchLoginTerm) {
            filter.login = {$regex: searchLoginTerm, $options: 'i'}
        }

        if (searchEmailTerm) {
            filter.email = {$regex: searchEmailTerm, $options: 'i'}
        }

        const users = await usersRepository.getUsersWithPagination(pageNumber, pageSize, sortBy, sortDirection, filter);
        const usersCount = await usersRepository.getUsersCount(filter);

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
    async getUser(id: string) {
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