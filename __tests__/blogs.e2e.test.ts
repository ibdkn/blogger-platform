import {SETTINGS} from "../src/settings";
import {req} from "./test-helpers";
import {blogs} from "../src/db/blogs.db";

let blogsDB = [];
describe('GET /blogs', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
        blogsDB = blogs;
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
        blogsDB = blogs;
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