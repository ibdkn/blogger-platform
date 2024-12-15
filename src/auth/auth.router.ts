import {Router} from "express";
import {authController} from "./authController";
import {routersPaths} from "../common/path/paths";
import {passwordValidation} from "../users/midlewares/password.validation";
import {loginOrEmailValidation} from "../users/midlewares/login.or.email.validation";
import {inputValidation} from "../common/validation/input.validation";
import {accessTokenGuard} from "./guards/access.token.guard";

export const authRouter: Router = Router();

authRouter.post(routersPaths.auth.login, passwordValidation, loginOrEmailValidation, inputValidation, authController.login);
authRouter.get(routersPaths.auth.me, accessTokenGuard, authController.me);