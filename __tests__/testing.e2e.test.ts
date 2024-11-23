import {req, setupTestData} from "./test-helpers";
import {postsCollection, runDb} from "../src/db/db";
import {SETTINGS} from "../src/settings";
import {MongoMemoryServer} from "mongodb-memory-server";

describe('DELETE /testing/all-data', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        // временная (in-memory) версия бд
        const server = await MongoMemoryServer.create();
        const url = server.getUri();
        await runDb(url);
        await postsCollection.deleteMany();
    });

    let insertedPostId: string;
    let insertedBlogId: string;
    let insertedBlogName: string;

    beforeEach(async () => {
        const result =  await setupTestData();
        insertedPostId = result.postId;
        insertedBlogId = result.blogId;
        insertedBlogName = result.blogName;
    });

    it('should delete all data', async () => {
        const res = await req
            .delete(SETTINGS.PATH.TESTING)
            .expect(204);

        console.log(res.body);

    });
});