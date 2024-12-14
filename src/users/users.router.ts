import {Router} from "express";
import {usersController} from "./users.controller";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validateUserFields} from "./users.validation";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";

export const usersRouter = Router();

// usersRouter.get('/', baseAuthGuard, usersController.getUsers);
// usersRouter.post('/', baseAuthGuard, ...validateUserFields, handleValidationErrors, usersController.createUser);
// usersRouter.delete('/:id', baseAuthGuard, usersController.deleteUser);