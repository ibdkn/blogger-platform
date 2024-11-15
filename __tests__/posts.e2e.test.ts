import {SETTINGS} from "../src/settings";
import {req} from "./test-helpers";
import {ADMIN_AUTH} from "../src/common/middlewares/auth.middleware";
import {setPostDB} from "../src/db/db";

describe('GET /posts', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
        setPostDB();
    })

    it('should return all posts', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            {id: '1', title: 'Post 1', shortDescription: 'description for post 1', content: 'content for post 1', blogId: '1', blogName: 'Blog 1',},
            {id: '2', title: 'Post 2', shortDescription: 'description for post 2', content: 'content for post 2', blogId: '1', blogName: 'Blog 1',},
            {id: '3', title: 'Post 3', shortDescription: 'description for post 3', content: 'content for post 3', blogId: '2', blogName: 'Blog 2',},
        ]);
    });
});

describe('GET /posts/{id}', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
         setPostDB();
    })

    it('should return a post by id', async () => {
        const postId = '2';
        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${postId}`)
            .expect(200)

        expect(res.status).toBe(200);
        expect(res.body.id).toEqual('2');
        expect(res.body).toEqual(
            {id: '2', title: 'Post 2', shortDescription: 'description for post 2', content: 'content for post 2', blogId: '1', blogName: 'Blog 1',},
        );
    });

    it('should return 404 not found', async () => {
        const postId = 4;
        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${postId}`)
            .expect(404)

        expect(res.status).toBe(404);
        expect(res.body).toStrictEqual({"errorsMessages": [{"field": "id", "message": "Post not found"}]});
    });
});

describe('POST /posts', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
         setPostDB();
    })
    it('should create a new post with valid data and authorization', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newPost = {
            id: '4',
            title: 'Post 4',
            shortDescription: 'description for post 4',
            content: 'content for post 4',
            blogId: '2',
            blogName: 'Blog 2',
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(201);

        console.log(res.body)
    });
    it('should return 400 if title is missing', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');

        const newPost = {
            shortDescription: 'description for post 4',
            content: 'content for post 4',
            blogId: '2',
            blogName: 'Blog 2'
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(400);

        console.log(res.body)
    });
    it('should return 401 Unauthorized', async () => {
        const newPost = {
            shortDescription: 'description for post 4',
            content: 'content for post 4',
            blogId: '2',
            blogName: 'Blog 2'
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost)
            .expect(401);

        console.log(res.body)
    });
});

describe('PUT /posts/{id}', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
         setPostDB();
    })
    it('should update post with new values', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '2';

        const newPost = {
            title: 'New title',
            shortDescription: 'new description',
            content: 'new content',
            blogId: '2',
        };

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(204);

        console.log(res.body);
    });
    it('should return 404 not found', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '3';

        const newPost = {
            title: 'New title',
            shortDescription: 'new description',
            content: 'new content',
            blogId: '88',
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(404);

        console.log(res.body);
    });
    it('should return 400 incorrect values', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '1';

        const newPost = {
            title: 'New title title title title title title title',
            shortDescription: '',
            content: '',
            blogId: '2',
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
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
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
         setPostDB();
    })
    it('should delete post', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '1';

        const res = await req
            .delete(`${SETTINGS.PATH.POSTS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(204);

        console.log(res.body);
    });
    it('should return 404 not found', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8');
        const codedAuth = buff2.toString('base64');
        const id = '4';

        const res = await req
            .delete(`${SETTINGS.PATH.POSTS}/${id}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(404);

        console.log(res.body);
    });
    it('should return 401 unauthorized', async () => {
        const id = '3';

        const res = await req
            .delete(`${SETTINGS.PATH.POSTS}/${id}`)
            .expect(401);

        console.log(res.body);
    });
});