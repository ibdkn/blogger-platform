import {commentsCollection, postsCollection} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {PostType} from "../posts/posts.types";
import {CommentType} from "./comments.type";

export const commentsRepository = {
    async getComment(id: string) {
        return await commentsCollection
            .findOne({_id: new ObjectId(id)});
    },
    async createComment(newComment: any) {
        return await commentsCollection
            .insertOne(newComment);
    },
    async updateComment(id: string, field: Pick<CommentType, 'content'>): Promise<UpdateResult> {
        return await commentsCollection
            .updateOne(
                {_id: new ObjectId(id)},
                {
                    $set: field
                })
    },
    async deleteComment(id: string):Promise<DeleteResult> {
        return await commentsCollection
            .deleteOne({_id: new ObjectId(id)})
    }
}