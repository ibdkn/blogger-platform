import {ObjectId, WithId} from "mongodb";
import {usersCollection} from "../db/db";
import {PaginationType} from "../common/types/pagination.types";
import {AppError} from "../common/types/error.types";
import {UserViewType} from "./types/user.view.type";
import {UserDBType} from "./types/user.db.type";
import {ResultStatus} from "../common/result/resultCode";

export const usersQueryRepository = {
    async findById(id: string): Promise<UserViewType | null> {
        const user: WithId<UserDBType> | null = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!user) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not Found',
                [{ field: 'password', message: 'User not found' }],
                null
            );
        }

        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    },
    async findAllUsers(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        searchLoginTerm: string | null,
        searchEmailTerm: string | null
    ): Promise<PaginationType<UserViewType>> {
        const filter: any = {};

        const orConditions = [
            searchLoginTerm && { login: { $regex: searchLoginTerm, $options: 'i' } },
            searchEmailTerm && { email: { $regex: searchEmailTerm, $options: 'i' } }
        ].filter(Boolean);

        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }

        const users: WithId<UserDBType>[] = await usersCollection
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

        const transformedUsers: UserViewType[] = users.map(user => ({
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
}