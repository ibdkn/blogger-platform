import {Request, Response} from "express";
import {usersService} from "./users.service";
import {usersQueryRepository} from "./users.query.repository";
import {paginationQueries} from "../helpers/pagination.helper";
import {UserViewModelType} from "./users.type";
import {ValidationErrorType} from "../common/types/error.types";
import {validateObjectId} from "../helpers/validation.helper";
import {PaginatedResult} from "../common/types/pagination.types";

export const usersController = {
    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchLoginTerm,
                searchEmailTerm,
            } = paginationQueries(req);

            const users: PaginatedResult<UserViewModelType> = await usersQueryRepository.getUsers(pageNumber, pageSize,
                sortBy, sortDirection, searchLoginTerm, searchEmailTerm);

            res.status(200).send(users);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const {login, password, email} = req.body;

            const userId: string = await usersService.createUser({login, passwordHash: password, email});

            const newUser: UserViewModelType | null = await usersQueryRepository.findUser(userId);

            res.status(201).send(newUser);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            await usersService.deleteUser(id);

            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}