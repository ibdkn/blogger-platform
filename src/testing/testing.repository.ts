import {blogsCollection, postsCollection, usersCollection} from "../db/db";

export const testingRepository = {
    async deleteAllData(): Promise<void> {
        await Promise.all([
            postsCollection.deleteMany({}),
            blogsCollection.deleteMany({}),
            usersCollection.deleteMany({})
        ]);
    }
}