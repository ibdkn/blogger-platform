import {ObjectId, WithId} from "mongodb";
import {usersCollection} from "../db/db";
import {usersRepository} from "./users.repository";
import {BlogViewModelType} from "../blogs/blogs.types";
import {UserType, UserTypeWithoutPassword, UserViewModelType} from "./users.type";
import {PaginatedResult} from "../common/types/pagination.types";

export const usersQueryRepository = {
    async getUsers(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        searchLoginTerm: string | null,
        searchEmailTerm: string | null
    ): Promise<PaginatedResult<UserViewModelType>> {
        const filter: any = {};

        const orConditions = [
            searchLoginTerm && { login: { $regex: searchLoginTerm, $options: 'i' } },
            searchEmailTerm && { email: { $regex: searchEmailTerm, $options: 'i' } }
        ].filter(Boolean);

        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }

        const users: WithId<UserType>[] = await usersCollection
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

        const transformedUsers: UserViewModelType[] = users.map(user => ({
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
    async findById(id: string): Promise<UserViewModelType | null> {
        const user: WithId<UserType> | null = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!user) return null;

        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    },
    // todo выпилить потом, как отрефакторим users
    async findUser(id: string): Promise<UserViewModelType | null> {
        const user: WithId<UserType> | null = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!user) return null;

        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    },
}