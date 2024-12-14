import {Request, Response} from "express";
import {commentsService} from "./comments.service";
import {DomainError, ValidationErrorType} from "../common/types/error.types";
import {validateObjectId} from "../helpers/validation.helper";
import {commentsQueryRepository} from "./comments.query.repository";
import {paginationQueries} from "../helpers/pagination.helper";
import {postsService} from "../posts/posts.service";

export const commentsController = {
    async getComment(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            const comment = await commentsQueryRepository.getComment(id);

            res.status(200).json(comment);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async getComments(req: Request, res: Response): Promise<void> {
        try {
            const {postId} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(postId);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = paginationQueries(req);

            const comments= await commentsQueryRepository.getComments(postId, pageNumber, pageSize, sortBy, sortDirection);

            res.status(200).json(comments);
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
            const authHeader = req.headers.authorization;

            if (authHeader) {
                const token = authHeader.split(' ')[1];
                const newCommentId = await commentsService.createComment(req.params.postId, req.body.content, token);
                const newComment = await commentsQueryRepository.createComment(newCommentId);
                res.status(201).json(newComment);
            } else {
                res.status(401).send({message: 'Unauthorized'});
            }
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
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                await commentsService.updateComment(id, req.body.content, token);
                res.status(204).json();
            } else {
                res.status(401)
            }
        } catch (e: any) {
            if (e instanceof DomainError) {
                res.status(e.status).json({ errorsMessages: e.errorMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                await commentsService.deleteComment(id, token);
                res.status(204).json();
            } else {
                res.status(401);
            }
        } catch (e: any) {
            if (e instanceof DomainError) {
                res.status(e.status).json({ errorsMessages: e.errorMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    }
}