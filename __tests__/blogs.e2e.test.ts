import {SETTINGS} from "../src/settings";
import {req} from "./test-helpers";
import {ADMIN_AUTH} from "../src/common/middlewares/auth.middleware";
import {setBlogDB} from "../src/db/db";

describe('GET /blogs', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
        setBlogDB();
    })

    it('should return all blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { id: '1', name: 'Blog 1', description: 'First blog', websiteUrl: 'https://samurai-blog-1.com' },
            { id: '2', name: 'Blog 2', description: 'Second blog', websiteUrl: 'https://samurai-blog-2.com' },
        ]);
    });
});

describe('GET /blogs/{id}', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
         setBlogDB();
    })

    it('should return a blog by id', async () => {
        const blogId = '2';
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body.id).toEqual('2');
        expect(res.body).toEqual(
            { id: '2', name: 'Blog 2', description: 'Second blog', websiteUrl: 'https://samurai-blog-2.com' },
        );
    });

    it('should return 404 Not Found', async () => {
        const blogId = 3;
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(404)

        expect(res.status).toBe(404);
        expect(res.body).toStrictEqual({"errorsMessages": [{"field": "id", "message": "Blog not found"}]});
    });
});

describe('POST /blogs', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
         setBlogDB();
    })
    it('should create a new blog with valid data and authorization', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newBlog = {
            name: 'Blog 3',
            description: 'Third blog',
            websiteUrl: 'https://samurai-blog-3.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(201);

        console.log(res.body)
    });
    it('should return 400 if name is missing', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newBlog = {
            description: 'Third blog',
            websiteUrl: 'https://samurai-blog-3.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(400);

        console.log(res.body)
    });
});

describe('PUT /blogs/{id}', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
         setBlogDB();
    })
    it('should update blog with new values', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '2';

        const newBlog = {
            name: 'New blog',
            description: 'New blog',
            websiteUrl: 'https://samurai-blog-new.com',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(204);

        console.log(res.body);
    });
    it('should return 404 not found', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '3';

        const newBlog = {
            name: 'New blog',
            description: 'New blog',
            websiteUrl: 'https://samurai-blog-new.com',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(404);

        console.log(res.body);
    });
    it('should return 400 incorrect values', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '1';

        const newBlog = {
            name: 'New blog blog blog blog blog blog',
            description: '',
            websiteUrl: 'incorrect url',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog)
            .expect(400);

        console.log(res.body);
    });
    it('should return 401 unauthorized', async () => {
        const id = '1';

        const newBlog = {
            name: 'New blog',
            description: 'New blog',
            websiteUrl: 'https://samurai-blog-new.com',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${id}`)
            .send(newBlog)
            .expect(401);

        console.log(res.body);
    });
});

describe('DELETE /blogs/{id}', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
         setBlogDB();
    })
    it('should delete blog', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '1';

        const res = await req
            .delete(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(204);

        console.log(res.body);
    });
    it('should return 404 not found', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '3';

        const res = await req
            .delete(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(404);

        console.log(res.body);
    });
    it('should return 401 unauthorized', async () => {
        const id = '1';

        const res = await req
            .delete(`${SETTINGS.PATH.BLOGS}/${id}`)
            .expect(401);

        console.log(res.body);
    });
});