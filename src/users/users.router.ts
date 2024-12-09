import {Router} from "express";
import {usersController} from "./users.controller";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validateUserFields} from "./users.validation";
import {authBaseGuard} from "../common/middlewares/authBase.guard";

export const usersRouter = Router();

usersRouter.get('/', authBaseGuard, usersController.getUsers);
usersRouter.post('/', authBaseGuard, ...validateUserFields, handleValidationErrors, usersController.createUser);
usersRouter.delete('/:id', authBaseGuard, usersController.deleteUser);