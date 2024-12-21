import {Request, Response} from "express";
import {usersService} from "./users.service";
import {usersQueryRepository} from "./users.query.repository";
import {paginationQueries} from "../helpers/pagination.helper";
import {AppError} from "../common/types/error.types";
import {validateObjectId} from "../helpers/validation.helper";
import {PaginationType} from "../common/types/pagination.types";
import {ResultStatus} from "../common/result/resultCode";
import {UserViewType} from "./types/user.view.type";
import {ExtensionType} from "../common/result/result.type";
import {resultCodeToHttpException} from "../common/result/resultCodeToHttpException";

export const usersController = {
    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchLoginTerm,
                searchEmailTerm,
            } = paginationQueries(req);

            const users: PaginationType<UserViewType> = await usersQueryRepository
                .findAllUsers(
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection,
                    searchLoginTerm,
                    searchEmailTerm
                );

            res.status(resultCodeToHttpException(ResultStatus.Success)).send(users);
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({message: 'Internal Server Error'});
            }
        }
    },
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const {login, password, email} = req.body;

            const userId: string = await usersService.createUser({login, password: password, email});

            const newUser: UserViewType | null = await usersQueryRepository.findById(userId);

            res.status(resultCodeToHttpException(ResultStatus.Created)).send(newUser);
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({message: 'Internal Server Error'});
            }
        }
    },
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            await usersService.deleteUser(id);

            res.status(resultCodeToHttpException(ResultStatus.NoContent)).send();
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({message: 'Internal Server Error'});
            }
        }
    }
}