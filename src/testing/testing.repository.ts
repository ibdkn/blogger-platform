import {blogsCollection, postsCollection} from "../db/db";

export const testingRepository = {
    async deleteAllData(): Promise<void> {
        await Promise.all([
            postsCollection.deleteMany({}),
            blogsCollection.deleteMany({})
        ]);
    }
}