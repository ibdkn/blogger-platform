"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsController = void 0;
const blogs_repository_1 = require("./blogs.repository");
exports.blogsController = {
    getBlogs(req, res) {
        const blogs = blogs_repository_1.blogsRepository.getAllBlogs();
        res.status(200).json(blogs);
    },
    getBlog(req, res) {
        const blog = blogs_repository_1.blogsRepository.getBlog(req.params.id);
        if (!blog) {
            res.status(404).json({
                errorsMessages: [{ field: 'id', message: 'Blog not found' }],
            });
        }
        res.status(200).json(blog);
    },
    createBlog(req, res) {
        const newBlog = blogs_repository_1.blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
        res.status(201).json(newBlog);
    },
    updateBlog(req, res) {
        const errors = blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
        }
        // Если всё успешно, отправляем 204
        res.status(204).send();
    },
    deleteBlog(req, res) {
        const errors = blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
        }
        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
};
