import {CommentType} from "./comments.type";
import {commentsRepository} from "./comments.repository";
import {postsRepository} from "../posts/posts.repository";
import {authService} from "../auth/auth.service";
import {usersRepository} from "../users/users.repository";
import {DeleteResult, UpdateResult, WithId} from "mongodb";
import {DomainError} from "../common/types/error.types";
import {PostType} from "../posts/posts.types";

export const commentsService = {
    async createComment(postId: string, content: string, token: string) {
        const post = await postsRepository.getPost(postId);

        if (!post) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Post not found'}]
            };
        }

        const userId = await authService.getUserIdByToken(token);

        const user = await usersRepository.getUser(userId.toString());

        if (!user) {
            throw {
                status: 404,
                errorsMessages: [{message: 'User not found'}]
            };
        }

        const newComment = {
            content,
            commentatorInfo: {
                userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }

        const result = await commentsRepository.createComment(newComment);
        return result.insertedId.toString();
    },
    async updateComment(id: string, content: string, token: string) {
        const comment = await commentsRepository.getComment(id);

        if (!comment) {
            throw new DomainError(
                404,
                [{message: 'Comment not found'}]
            );
        }

        const userId = await authService.getUserIdByToken(token);
        const user = await usersRepository.getUser(userId.toString());

        if (!user) {
            throw new DomainError(
                404,
                [{message: 'User not found'}]
            );
        }

        if (comment.commentatorInfo.userId.toString() !== userId.toString()) {
            throw new DomainError(
                403,
                [{message: 'You can only edit your own comments'}]
            );
        }

        const updatedField: Pick<CommentType, 'content'> = { content };
        const result: UpdateResult = await commentsRepository.updateComment(id, updatedField);

        if (result.matchedCount === 0) {
            throw new DomainError(
                500,
                [{message: 'Failed to update the post'}]
            );
        }
    },
    async deleteComment(id: string, token: string) {
        const comment = await commentsRepository.getComment(id);

        console.log(comment)

        if (!comment) {
            throw new DomainError(
                404,
                [{message: 'Comment not found'}]
            );
        }

        const userId = await authService.getUserIdByToken(token);
        const user = await usersRepository.getUser(userId.toString());

        if (!user) {
            throw new DomainError(
                404,
                [{message: 'User not found'}]
            );
        }

        if (comment.commentatorInfo.userId.toString() !== userId.toString()) {
            throw new DomainError(
                403,
                [{message: 'You can only edit your own comments'}]
            );
        }

        const result: DeleteResult = await commentsRepository.deleteComment(id);

        if (result.deletedCount === 0) {
            throw new DomainError(
                404,
                [{message: 'Comment was not deleted'}]
            );
        }
    }
}