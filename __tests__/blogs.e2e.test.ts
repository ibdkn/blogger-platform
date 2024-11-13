import {SETTINGS} from "../src/settings";
import {req} from "./test-helpers";
import {blogDB} from "../src/db/blogs.db";
import {ADMIN_AUTH} from "../src/common/middlewares/auth.middleware";

let blogsDB = [];
describe('GET /blogs', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
        blogsDB = blogDB;
    })

    it('should return all blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { id: 1, name: 'Blog 1', description: 'First blog', websiteUrl: 'https://samurai-blog-1.com' },
            { id: 2, name: 'Blog 2', description: 'Second blog', websiteUrl: 'https://samurai-blog-2.com' },
        ]);
    });
});

describe('GET /blogs/{id}', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
        blogsDB = blogDB;
    })

    it('should return a blog by id', async () => {
        const blogId = 2;
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body.id).toEqual(2);
        expect(res.body).toEqual(
            { id: 2, name: 'Blog 2', description: 'Second blog', websiteUrl: 'https://samurai-blog-2.com' },
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

describe('/post', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
        blogsDB = blogDB;
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