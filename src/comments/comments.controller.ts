import {Request, Response} from "express";
import {commentsService} from "./comments.service";
import {AppError, ValidationErrorType} from "../common/types/error.types";
import {validateObjectId} from "../helpers/validation.helper";
import {commentsQueryRepository} from "./comments.query.repository";
import {paginationQueries} from "../helpers/pagination.helper";
import {resultCodeToHttpException} from "../common/result/resultCodeToHttpException";
import {ResultStatus} from "../common/result/resultCode";
import {CommentViewType} from "./types/commment.type";
import {PaginationType} from "../common/types/pagination.types";
import {ExtensionType} from "../common/result/result.type";

export const commentsController = {
    async getComment(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            const comment: CommentViewType | null = await commentsQueryRepository.getById(id);

            res.status(resultCodeToHttpException(ResultStatus.Success)).json(comment);
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
    async getComments(req: Request, res: Response): Promise<void> {
        try {
            const {postId} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(postId);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = paginationQueries(req);

            const comments: PaginationType<CommentViewType> = await commentsQueryRepository
                .getAllComments(postId, pageNumber, pageSize, sortBy, sortDirection);

            res.status(resultCodeToHttpException(ResultStatus.Success)).json(comments);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async createComment(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.user?.id as string;

            const newCommentId: string = await commentsService.create(userId, req.params.postId, req.body.content);
            const newComment: CommentViewType  = await commentsQueryRepository.getById(newCommentId) as CommentViewType;

            res.status(resultCodeToHttpException(ResultStatus.Created)).json(newComment);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async updateComment(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.user?.id as string;
            const {id, content} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            await commentsService.update(userId, id, content);
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
    },
    async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.user?.id as string;
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            await commentsService.delete(userId, id);
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