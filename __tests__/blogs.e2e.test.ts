import {SETTINGS} from "../src/settings";
import {ADMIN_AUTH} from "../src/common/middlewares/auth.middleware";
import {blogsCollection, runDb} from "../src/db/db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {ObjectId} from "mongodb";
import {createTestBlog, req} from "./test-helpers";

describe('GET /blogs', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        // вариант для работы с реальной бд
        // await runDb(SETTINGS.MONGO_URL);
        // await blogsCollection.deleteMany();

        // временная (in-memory) версия бд
        const server = await MongoMemoryServer.create();
        const url = server.getUri();
        await runDb(url);
        await blogsCollection.deleteMany();
    })

    it('should return all blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        expect(res.status).toBe(200);
    });
});

describe('GET /blogs/{id}', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        const server = await MongoMemoryServer.create();
        const url = server.getUri();
        await runDb(url);
        await blogsCollection.deleteMany();
    })

    let insertedBlogId: string;
    beforeEach(async () => {
        insertedBlogId = await createTestBlog();
    });

    it('should return a blog by id', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}`)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({
            id: insertedBlogId,
            name: 'Test Blog',
            description: 'Test Description',
            websiteUrl: 'https://testblog.com',
            createdAt: expect.any(String),
            isMembership: false,
        });
    });

    it('should return 404 Not Found', async () => {
        const blogId = new ObjectId();
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(404)

        expect(res.status).toBe(404);
        expect(res.body).toStrictEqual({"errorsMessages": [{"field": "id", "message": "Blog not found"}]});
    });
});

describe('POST /blogs', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        const server = await MongoMemoryServer.create();
        const url = server.getUri();
        await runDb(url);
        await blogsCollection.deleteMany();
    })

    let insertedBlogId: string;
    beforeEach(async () => {
        insertedBlogId = await createTestBlog();
    });

    it('should create a new blog with valid data and authorization', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newBlog = {
            name: 'New Test Blog',
            description: 'New Test Description',
            websiteUrl: 'https://newtestblog.com',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'New Test Blog');
        expect(res.body).toHaveProperty('description', 'New Test Description');
        expect(res.body).toHaveProperty('websiteUrl', 'https://newtestblog.com');
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('isMembership', true);
    });

    it('should return 400 if name is missing', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newBlog = {
            name: 'New Test Blog have a very long name',
            description: '',
            websiteUrl: 'incorrect url',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(400);

        expect(res.body).toHaveProperty('errorsMessages');
        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                { field: 'name', message: 'Name must be at most 15 symbols' },
                { field: 'websiteUrl', message: 'Website URL is invalid' },
                { field: 'description', message: 'Description is required' },
            ])
        );
    });

    it('should return 400 if fields are incorrect', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newBlog = {
            description: 'New Test Description',
            websiteUrl: 'https://newtestblog.com',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(400);

        console.log(res.body);
        expect(res.body.name).toBeUndefined();
        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                { field: 'name', message: 'Name is required' }
            ])
        );
    });
});

describe('PUT /blogs/{id}', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        const server = await MongoMemoryServer.create();
        const url = server.getUri();
        await runDb(url);
        await blogsCollection.deleteMany();
    })

    let insertedBlogId: string;
    beforeEach(async () => {
        insertedBlogId = await createTestBlog();
    });

    it('should update blog with new values', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newBlog = {
            name: 'Updated blog',
            description: 'Updated Description',
            websiteUrl: 'https://updatedtestblog.com',
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(204);

        // Выполняем GET запрос для проверки обновленных данных
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}`)
            .expect(200);

        console.log(res.body);
        expect(res.body.name).toEqual('Updated blog');
        expect(res.body.description).toEqual('Updated Description');
        expect(res.body.websiteUrl).toEqual('https://updatedtestblog.com');
    });

    it('should return 404 not found', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newBlog = {
            name: 'Updated blog',
            description: 'Updated Description',
            websiteUrl: 'https://updatedtestblog.com',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}123`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(404);

        console.log(res.body);
        expect(res.body).toHaveProperty('errorsMessages');
        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                { field: 'id', message: 'Invalid ObjectId' }
            ])
        );
    });

    it('should return 400 incorrect values', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newBlog = {
            name: 'Updated blog with a very long name',
            description: '',
            websiteUrl: 'incorrect url',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(400);

        console.log(res.body);
        expect(res.body).toHaveProperty('errorsMessages');
        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                { field: 'name', message: 'Name must be at most 15 symbols' },
                { field: 'websiteUrl', message: 'Website URL is invalid' },
                { field: 'description', message: 'Description is required' }
            ])
        );
    });

    it('should return 401 unauthorized', async () => {
        const newBlog = {
            name: 'Updated blog',
            description: 'Updated Description',
            websiteUrl: 'https://updatedtestblog.com',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}`)
            .send(newBlog)
            .expect(401);

        console.log(res.body);
        expect(res.body).toEqual({ message: 'Unauthorized' });
    });
});

describe('DELETE /blogs/{id}', () => {
    // Перед каждым тестом очищаем "базу данных" и добавляем фиктивные данные
    beforeAll(async () => {
        const server = await MongoMemoryServer.create();
        const url = server.getUri();
        await runDb(url);
        await blogsCollection.deleteMany();
    })

    let insertedBlogId: string;
    beforeEach(async () => {
        insertedBlogId = await createTestBlog();
    });

    it('should delete blog', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(204);

        // Выполняем GET запрос для проверки обновленных данных
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}`)
            .expect(200);

        console.log(res.body);
        expect(res.body).toEqual([]);
    });

    it('should return 404 not found', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const res = await req
            .delete(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}123`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(404);

        console.log(res.body);
        expect(res.body).toHaveProperty('errorsMessages');
        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                { field: 'id', message: 'Invalid ObjectId' }
            ])
        );
    });

    it('should return 401 unauthorized', async () => {
        const res = await req
            .delete(`${SETTINGS.PATH.BLOGS}/${insertedBlogId}`)
            .expect(401);

        console.log(res.body);
        expect(res.body).toEqual({ message: 'Unauthorized' });
    });
});