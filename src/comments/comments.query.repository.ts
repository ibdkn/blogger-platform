import {commentsCollection, postsCollection, usersCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {UserType} from "../users/users.type";

export const commentsQueryRepository = {
    async getComment(id: string) {
        const comment = await commentsCollection
            .findOne({_id: new ObjectId(id)});

        if (!comment) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Comment not found'}]
            };
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
    async getComments(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ) {
        const post = await postsCollection
            .findOne({_id: new ObjectId(postId)});

        if (!post) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Post with the given postId does not exist'}]
            };
        }

        const comments = await commentsCollection
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

        const transformedComments = comments.map(comment => ({
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
    async createComment(id: string) {
        const comment = await commentsCollection
            .findOne({ _id: new ObjectId(id) });

        if (!comment) return null;

        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
        };
    }
}