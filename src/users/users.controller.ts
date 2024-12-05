import {Request, Response} from "express";
import {usersService} from "./users.service";
import {usersQueryRepository} from "./users.query.repository";
import {usersRepository} from "./users.repository";

export const usersController = {
    async getUsers(req: Request, res: Response) {
        try {
            const users = await usersService.getUsers();

            // todo добавить пагинацию, query repo
            res.status(201).send(users);
        } catch (e: any) {
            console.error('Error occurred while fetching posts:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getUser(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const userId = await usersService.getUser(id);

            const user = await usersQueryRepository.getUser(userId);

            res.status(201).send(user);
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
            console.error('Error occurred while fetching posts:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async deleteUser(req: Request, res: Response) {
        try {
            const {id} = req.params;

            await usersService.deleteUser(id);

            res.status(204).send();
        } catch (e) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}