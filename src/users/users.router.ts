import {Router} from "express";
import {usersController} from "./users.controller";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validateUserFields} from "./users.validation";
import {authMiddleware} from "../common/middlewares/auth.middleware";

export const usersRouter = Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.post('/', authMiddleware, ...validateUserFields, handleValidationErrors, usersController.createUser);
usersRouter.delete('/:id', authMiddleware, usersController.deleteUser);