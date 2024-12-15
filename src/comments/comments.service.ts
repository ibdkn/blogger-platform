import {commentsRepository} from "./comments.repository";
import {postsRepository} from "../posts/posts.repository";
import {usersRepository} from "../users/users.repository";
import {DeleteResult, UpdateResult, WithId} from "mongodb";
import {AppError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {CommentType, CommentTypeWithPostId} from "./types/commment.type";
import {UserDBType} from "../users/types/user.db.type";
import {PostType} from "../posts/posts.types";
import {loginValidation} from "../users/midlewares/login.valitation";

export const commentsService = {
    async create(userId: string, postId: string, content: string): Promise<string> {
        const post: WithId<PostType> | null = await postsRepository.getById(postId);

        if (!post) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Post with the given postId does not exist'}],
                null
            );
        }

        const user: WithId<UserDBType> | null = await usersRepository.doesExistById(userId);

        if (!user) {
            throw new AppError(
                ResultStatus.NotFound,
                'User not found',
                [{ message: 'User not found' }],
                null
            );
        }

        const newComment: CommentTypeWithPostId = {
            postId,
            content,
            commentatorInfo: {
                userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }

        return await commentsRepository.create(newComment);
    },
    async update(userId: string, id: string, content: string): Promise<void> {
        const comment: WithId<CommentType> | null = await commentsRepository.getById(id);

        if (!comment) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{ message: 'Comment not found' }],
                null
            );
        }

        const user: UserDBType | null = await usersRepository.doesExistById(userId);

        if (!user) {
            throw new AppError(
                ResultStatus.NotFound,
                'User not found',
                [{ message: 'User not found' }],
                null
            );
        }

        if (comment.commentatorInfo.userId.toString() !== userId) {
            throw new AppError(
                ResultStatus.Forbidden,
                'Forbidden',
                [{ message: 'You can only edit your own comments' }],
                null
            );
        }

        const updatedField: Pick<CommentType, 'content'> = { content };
        console.log(updatedField);
        const result: UpdateResult = await commentsRepository.update(id, updatedField);

        if (result.matchedCount === 0) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{ message: 'Failed to update the post' }],
                null
            );
        }
    },
    async delete(userId: string, id: string): Promise<void> {
        const comment: WithId<CommentType> | null = await commentsRepository.getById(id);

        if (!comment) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{ message: 'Comment not found' }],
                null
            );
        }

        const user: WithId<UserDBType> | null = await usersRepository.doesExistById(userId);

        if (!user) {
            throw new AppError(
                ResultStatus.Unauthorized,
                'Unauthorized',
                [{ message: 'User not found' }],
                null
            );
        }

        if (comment.commentatorInfo.userId.toString() !== userId) {
            throw new AppError(
                ResultStatus.Forbidden,
                'Forbidden',
                [{ message: 'You can only edit your own comments' }],
                null
            );
        }

        const result: DeleteResult = await commentsRepository.delete(id);

        if (result.deletedCount === 0) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{ message: 'Comment was not deleted' }],
                null
            );
        }
    }
}