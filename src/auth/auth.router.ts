import {Router} from "express";
import {authController} from "./auth.controller";
import {routersPaths} from "../common/path/paths";
import {passwordValidation} from "../users/midlewares/password.validation";
import {loginOrEmailValidation} from "../users/midlewares/login.or.email.validation";
import {inputValidation} from "../common/validation/input.validation";
import {accessTokenGuard} from "./guards/access.token.guard";
import {emailValidation} from "../users/midlewares/email.validation";
import {loginValidation} from "../users/midlewares/login.valitation";

export const authRouter: Router = Router();

authRouter.post(routersPaths.auth.login, passwordValidation, loginOrEmailValidation, inputValidation, authController.login);
authRouter.get(routersPaths.auth.me, accessTokenGuard, authController.me);

authRouter.post(routersPaths.auth.registration, loginValidation, passwordValidation, emailValidation, inputValidation, authController.register);
authRouter.post(routersPaths.auth.registrationConfirmation, authController.registrationConfirmation);
authRouter.post(routersPaths.auth.registrationEmailResending, emailValidation, inputValidation, authController.registrationEmailResending);
