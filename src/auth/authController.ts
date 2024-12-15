import {Response} from "express";
import {authService} from "./auth.service";
import {AppError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {HttpStatuses} from "../common/types/httpStatuses";
import {usersQueryRepository} from "../users/users.query.repository";
import {RequestWithBody, RequestWithUserId} from "../common/types/requests";
import {IdType} from "../common/types/id";
import {LoginInputDto} from "./types/login.input.dto";
import {UserViewModelType} from "../users/users.type";

export const authController = {
    async login(req: RequestWithBody<LoginInputDto>, res: Response): Promise<void> {
        try {
            const {loginOrEmail, password} = req.body;
            const result = await authService.loginUser(loginOrEmail, password);

            res.status(HttpStatuses.Success).send({accessToken: result.data!.accessToken});
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(e.status).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(HttpStatuses.ServerError).send({ message: ResultStatus.InternalServerError });
            }
        }
    },
    async me(req: RequestWithUserId<IdType>, res: Response): Promise<void> {
        try {
            const userId: string = req.user?.id as string;

            const me: UserViewModelType | null = await usersQueryRepository.findById(userId);

            res.status(HttpStatuses.Success).send(me);
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(e.status).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(HttpStatuses.ServerError).send({ message: ResultStatus.InternalServerError });
            }
        }
    }
}