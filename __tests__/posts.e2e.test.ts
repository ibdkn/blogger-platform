import {SETTINGS} from "../src/settings";
import {req, setupTestData} from "./test-helpers";
import {ADMIN_AUTH} from "../src/common/middlewares/auth.middleware";
import {blogsCollection, postsCollection, runDb} from "../src/db/db";
import {MongoMemoryServer} from "mongodb-memory-server";

describe('GET /posts', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        // вариант для работы с реальной бд
        // await runDb(SETTINGS.MONGO_URL);
        // await blogsCollection.deleteMany();

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

    it('should return all posts', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        expect(res.status).toBe(200);
        console.log(res.body)
    });
});

describe('GET /posts/{id}', () => {
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

    it('should return a post by id', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${insertedPostId}`)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({
            id: insertedPostId,
            title: 'Post 1',
            shortDescription: 'This is a short description for Post 1',
            content: 'Detailed content for Post 1',
            blogId: insertedBlogId,
            blogName: insertedBlogName,
            createdAt: expect.any(String),
        });
    });

    it('should return 404 not found', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/673f8d910c6c9590f35ce330`)
            .expect(404)

        expect(res.status).toBe(404);
        console.log(res.body)
        expect(res.body).toStrictEqual({"errorsMessages": [{"message": "Post not found"}]});
    });
});

describe('GET /{blogId}/posts', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        const server = await MongoMemoryServer.create();
        const url = server.getUri();
        await runDb(url);
        await blogsCollection.deleteMany();
    })

    let insertedPostId: string;
    let insertedBlogId: string;
    let insertedBlogName: string;

    beforeEach(async () => {
        const result =  await setupTestData();
        insertedPostId = result.postId;
        insertedBlogId = result.blogId;
        insertedBlogName = result.blogName;
    });

    it('should return the post by blog id', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}/posts`)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body.items[0].title).toStrictEqual('Post 1');
        expect(res.body.items[0].shortDescription).toStrictEqual('This is a short description for Post 1');
        expect(res.body.items[0].blogName).toStrictEqual('Test Blog');
        expect(res.body.items[0].content).toStrictEqual('Detailed content for Post 1');
    });

    it('should return 404 the blog does not exist ', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/674b70548cd71c3e3248163a/posts`)
            .expect(404)

        expect(res.status).toBe(404);
        expect(res.body).toStrictEqual({"errorsMessages": [{"message": "Blog with the given blogId does not exist"}]});
    });
});

describe('POST /posts', () => {
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

    it('should create a new post with valid data and authorization', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newPost = {
            title: 'Post 1',
            shortDescription: 'This is a short description for Post 1',
            content: 'Detailed content for Post 1',
            blogId: insertedBlogId,
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('title', 'Post 1');
        expect(res.body).toHaveProperty('shortDescription', 'This is a short description for Post 1');
        expect(res.body).toHaveProperty('content', 'Detailed content for Post 1');
        expect(res.body).toHaveProperty('blogId', insertedBlogId);
        expect(res.body).toHaveProperty('blogName', insertedBlogName);
        expect(res.body).toHaveProperty('createdAt');
    });

    it('should return 400 if title is missing', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newPost = {
            shortDescription: 'This is a short description for Post 1',
            content: 'Detailed content for Post 1',
            blogId: insertedBlogId,
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(400);

        console.log(res.body);
        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                { field: 'title', message: 'Title is required' }
            ])
        );
    });

    it('should return 401 Unauthorized', async () => {
        const newPost = {
            title: 'Post 1',
            shortDescription: 'This is a short description for Post 1',
            content: 'Detailed content for Post 1',
            blogId: insertedBlogId,
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost)
            .expect(401);

        console.log(res.body);
        expect(res.body).toEqual({ message: 'Unauthorized' });
    });
});

describe('POST /{blogId}/posts', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        const server = await MongoMemoryServer.create();
        const url = server.getUri();
        await runDb(url);
        await blogsCollection.deleteMany();
    })

    let insertedPostId: string;
    let insertedBlogId: string;
    let insertedBlogName: string;

    beforeEach(async () => {
        const result =  await setupTestData();
        insertedPostId = result.postId;
        insertedBlogId = result.blogId;
        insertedBlogName = result.blogName;
    });

    it('should create the new post for specific blog with valid data and authorization', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newPost = {
            title: 'Post 1',
            shortDescription: 'This is a short description for Post 1',
            content: 'Detailed content for Post 1',
            blogId: insertedBlogId,
        }

        const res = await req
            .post(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}/posts`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(201);

        expect(res.status).toBe(201);
        expect(res.body.title).toStrictEqual('Post 1');
        expect(res.body.shortDescription).toStrictEqual('This is a short description for Post 1');
        expect(res.body.blogName).toStrictEqual('Test Blog');
        expect(res.body.content).toStrictEqual('Detailed content for Post 1');
    });

    it('should return 400 if title is missing', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newPost = {
            shortDescription: 'This is a short description for Post 1',
            content: 'Detailed content for Post 1',
            blogId: insertedBlogId,
        }

        const res = await req
            .post(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}/posts`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(400);

        console.log(res.body);
        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                { field: 'title', message: 'Title is required' }
            ])
        );
    });

    it('should return 401 Unauthorized', async () => {
        const newPost = {
            title: 'Post 1',
            shortDescription: 'This is a short description for Post 1',
            content: 'Detailed content for Post 1',
            blogId: insertedBlogId,
        }

        const res = await req
            .post(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}/posts`)
            .send(newPost)
            .expect(401);

        console.log(res.body);
        expect(res.body).toEqual({ message: 'Unauthorized' });
    });
});

describe('PUT /posts/{id}', () => {
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

    it('should update post with new values', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const updatedPost = {
            title: 'Updated post',
            shortDescription: 'This is a short description for Updated post',
            content: 'Detailed content for Updated post',
            blogId: insertedBlogId,
        };

        await req
            .put(`${SETTINGS.PATH.POSTS}/${insertedPostId}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(updatedPost)
            .expect(204);

        // Выполняем GET запрос для проверки обновленных данных
        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${insertedPostId}`)
            .expect(200);

        console.log(res.body);
        expect(res.body.title).toEqual('Updated post');
        expect(res.body.shortDescription).toEqual('This is a short description for Updated post');
        expect(res.body.content).toEqual('Detailed content for Updated post');
    });

    it('should return 404 not found', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const postId = '6741abc7910429194a13b8a2';

        const updatedPost = {
            title: 'Updated post',
            shortDescription: 'This is a short description for Updated post',
            content: 'Detailed content for Updated post',
            blogId: insertedBlogId,
        };

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postId}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(updatedPost)
            .expect(404);

        console.log(res.body);
        expect(res.body).toHaveProperty('errorsMessages');
        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                { message: 'Post not found' }
            ])
        );
    });

    it('should return 400 incorrect values', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const updatedPost = {
            title: 'Updated post with very long title',
            shortDescription: '',
            content: '',
            // blogId: insertedBlogId,
        };

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${insertedPostId}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(updatedPost)
            .expect(400);

        console.log(res.body);
    });

    it('should return 401 unauthorized', async () => {
        const id = '1';

        const newPost = {
            title: 'New title',
            shortDescription: 'new description',
            content: 'new content',
            blogId: '2',
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${id}`)
            .send(newPost)
            .expect(401);

        console.log(res.body);
    });
});

describe('DELETE /posts/{id}', () => {
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

    it('should delete post', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const res = await req
            .delete(`${SETTINGS.PATH.POSTS}/${insertedPostId}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(204);

        console.log(res.body);
    });

    it('should return 404 not found', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const postId = '6741abc7910429194a13b8a2'

        const res = await req
            .delete(`${SETTINGS.PATH.POSTS}/${postId}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(404);

        console.log(res.body);
    });
    it('should return 401 unauthorized', async () => {
        const res = await req
            .delete(`${SETTINGS.PATH.POSTS}/${insertedPostId}`)
            .expect(401);

        console.log(res.body);
    });
});