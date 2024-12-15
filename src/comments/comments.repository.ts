import {commentsCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";
import {CommentType, CommentTypeWithPostId} from "./types/commment.type";

export const commentsRepository = {
    async getById(id: string): Promise<WithId<CommentType> | null> {
        return await commentsCollection.findOne({_id: new ObjectId(id)});
    },
    async create(newComment: CommentTypeWithPostId): Promise<string> {
        const result: InsertOneResult<CommentTypeWithPostId> = await commentsCollection.insertOne(newComment);
        return result.insertedId.toString();
    },
    async update(id: string, field: Pick<CommentType, 'content'>): Promise<UpdateResult> {
        return await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: field});
    },
    async delete(id: string): Promise<DeleteResult> {
        return await commentsCollection.deleteOne({_id: new ObjectId(id)})
    }
}