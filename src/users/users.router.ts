import {Router} from "express";
import {usersController} from "./users.controller";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {routersPaths} from "../common/path/paths";
import {loginValidation} from "./midlewares/login.valitation";
import {emailValidation} from "./midlewares/email.validation";
import {passwordValidation} from "./midlewares/password.validation";
import {inputValidation} from "../common/validation/input.validation";

export const usersRouter: Router = Router();

usersRouter.get(routersPaths.common, baseAuthGuard, usersController.getUsers);
usersRouter.post(routersPaths.common, baseAuthGuard, loginValidation, passwordValidation, emailValidation,
    inputValidation, usersController.createUser);
usersRouter.delete(routersPaths.id, baseAuthGuard, usersController.deleteUser);