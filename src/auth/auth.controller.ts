import {Response} from "express";
import {authService} from "./auth.service";
import {AppError} from "../common/types/error.types";
import {usersQueryRepository} from "../users/users.query.repository";
import {RequestWithBody, RequestWithUserId} from "../common/types/requests";
import {IdType} from "../common/types/id";
import {LoginInputDto} from "./types/login.input.dto";
import {Result} from "../common/result/result.type";
import {AccessTokenType} from "./types/auth.token.type";
import {resultCodeToHttpException} from "../common/result/resultCodeToHttpException";
import {ResultStatus} from "../common/result/resultCode";
import {RegistrationInputDto} from "./types/registration.input.dto";
import {UserViewType} from "../users/types/user.view.type";
import {CodeConfirmType} from "./types/code.confirm.type";
import {WithId} from "mongodb";
import {UserDBType} from "../users/types/user.db.type";

export const authController = {
    async login(req: RequestWithBody<LoginInputDto>, res: Response): Promise<void> {
        try {
            const {loginOrEmail, password} = req.body;

            const result: Result<AccessTokenType | null> = await authService.loginUser(loginOrEmail, password);

            res.status(resultCodeToHttpException(ResultStatus.Success))
                .send({accessToken: result.data!.accessToken});
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({ message: 'Internal Server Error' });
            }
        }
    },
    async me(req: RequestWithUserId<IdType>, res: Response): Promise<void> {
        try {
            const userId: string = req.user?.id as string;

            const me: UserViewType | null = await usersQueryRepository.findById(userId);

            res.status(resultCodeToHttpException(ResultStatus.Success)).send(me);
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({ message: 'Internal Server Error' });
            }
        }
    },
    async registerUser(req: RequestWithBody<RegistrationInputDto>, res: Response): Promise<void>  {
        try {
            const { login, password, email } = req.body;

            const result: Result<UserDBType> = await authService.register(login, password, email);
            if (result.status === ResultStatus.Success) {
                res.status(resultCodeToHttpException(ResultStatus.NoContent)).send();
            } else {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).send({ errorsMessages: 'Bad Request' });
            }
        } catch (e) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send({ errorsMessages: e.extensions });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({ message: 'Internal Server Error' });
            }
        }
    },
    async confirmRegistration(req: RequestWithBody<CodeConfirmType>, res: Response): Promise<void> {
        try {
            const { code } = req.body;

            await authService.confirm(code);
            res.status(resultCodeToHttpException(ResultStatus.NoContent)).send();
        } catch (e) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send({ errorsMessages: e.extensions });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({ message: 'Internal Server Error' });
            }
        }
    },
    async resendConfirmationCode(req: RequestWithBody<Pick<UserViewType, 'email'>>, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            const result: Result<WithId<UserDBType>> = await authService.resendCode(email);
            if (result.status === ResultStatus.Success) {
                res.status(resultCodeToHttpException(ResultStatus.NoContent)).send();
            } else {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).send({ errorsMessages: 'Bad Request' });
            }
        } catch (e) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send({ errorsMessages: e.extensions });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({ message: 'Internal Server Error' });
            }
        }
    }
}