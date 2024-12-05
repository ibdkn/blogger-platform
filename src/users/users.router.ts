import {Router} from "express";
import {usersController} from "./users.controller";

export const usersRouter = Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/:id', usersController.getUser);
usersRouter.post('/', usersController.createUser);
usersRouter.delete('/:id', usersController.deleteUser);