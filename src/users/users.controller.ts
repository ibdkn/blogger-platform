import {Request, Response} from "express";
import {usersService} from "./users.service";
import {usersQueryRepository} from "./users.query.repository";
import {paginationQueries} from "../helpers/pagination.helper";

export const usersController = {
    async getUsers(req: Request, res: Response) {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchLoginTerm,
                searchEmailTerm,
            } = paginationQueries(req);

            const users = await usersQueryRepository.getUsers(pageNumber, pageSize, sortBy, sortDirection,
                searchLoginTerm, searchEmailTerm);

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
    async createUser(req: Request, res: Response) {
        try {
            const {login, password, email} = req.body;

            // Создаем пользователя через сервис
            const userId = await usersService.createUser({login, password, email});

            // Получаем данные пользователя для ViewModel
            const newUser = await usersQueryRepository.createUser(userId);

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
    async deleteUser(req: Request, res: Response) {
        try {
            const {id} = req.params;

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