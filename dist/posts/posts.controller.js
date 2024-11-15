"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsController = void 0;
const posts_repository_1 = require("./posts.repository");
exports.postsController = {
    getPosts(req, res) {
        const posts = posts_repository_1.postsRepository.getAllPosts();
        res.status(200).json(posts);
    },
    getPost(req, res) {
        const post = posts_repository_1.postsRepository.getPost(req.params.id);
        if (!post) {
            res.status(404).json({
                errorsMessages: [{ field: 'id', message: 'Post not found' }],
            });
        }
        res.status(200).json(post);
    },
    createPost(req, res) {
        const newPost = posts_repository_1.postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
        res.status(201).json(newPost);
    },
    updatePost(req, res) {
        const errors = posts_repository_1.postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
        }
        // Если всё успешно, отправляем 204
        res.status(204).send();
    },
    deletePost(req, res) {
        const errors = posts_repository_1.postsRepository.deletePost(req.params.id);
        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
        }
        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
};
