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
        const blog = blogs_repository_1.blogsRepository.getBlog(+req.params.id);
        if (!blog) {
            res.status(404).json({
                errorsMessages: [{ field: 'id', message: 'Blog not found' }],
            });
        }
        res.status(200).json(blog);
    }
};
