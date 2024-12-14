import {Request, Response} from "express";
import {authService} from "./auth.service";
import {AppError, DomainError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {HttpStatuses} from "../common/types/httpStatuses";
import {usersQueryRepository} from "../users/users.query.repository";

export const authController = {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const {loginOrEmail, password} = req.body;
            const result = await authService.loginUser(loginOrEmail, password);

            res.status(HttpStatuses.Success).send({accessToken: result.data!.accessToken});
        } catch (e: any) {
            if (e instanceof AppError) {
                console.log(e.message)
                res.status(e.status).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(HttpStatuses.ServerError).send({ message: ResultStatus.InternalServerError });
            }
        }
    },
    async me(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            const me = await usersQueryRepository.findById(userId);

            res.status(HttpStatuses.Success).send(me);
        } catch (e: any) {
            if (e instanceof DomainError) {
                console.log(111111)
                res.status(e.status).json({ errorsMessages: e.errorMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    }
}