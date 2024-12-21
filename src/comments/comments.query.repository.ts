import {commentsCollection, postsCollection, usersCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {CommentType, CommentViewType} from "./types/commment.type";
import {AppError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";
import {PostType} from "../posts/posts.types";
import {PaginationType} from "../common/types/pagination.types";

export const commentsQueryRepository = {
    async getById(id: string): Promise<CommentViewType | null> {
        const comment: WithId<CommentType> | null = await commentsCollection.findOne({_id: new ObjectId(id)});

        if (!comment) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Comment not found'}],
                null
            );
        }

        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
        };
    },
    async getAllComments(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ): Promise<PaginationType<CommentViewType>> {
        const post: PostType | null = await postsCollection.findOne({_id: new ObjectId(postId)});

        if (!post) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Post with the given postId does not exist'}],
                null
            );
        }

        const comments: WithId<CommentType>[] | null = await commentsCollection
            .find({postId})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1} as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        if (!comments) {
            return {
                pagesCount: 0,
                page: pageNumber,
                pageSize,
                totalCount: 0,
                items: []
            }
        }

        const commentsCount: number = await commentsCollection.countDocuments({postId});

        const transformedComments: CommentViewType[] = comments.map(comment => ({
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
        }));

        return {
            pagesCount: Math.ceil(commentsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: commentsCount,
            items: transformedComments
        }
    },
}