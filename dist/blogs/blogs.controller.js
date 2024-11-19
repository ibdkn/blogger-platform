"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsController = void 0;
const blogs_repository_1 = require("./blogs.repository");
exports.blogsController = {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield blogs_repository_1.blogsRepository.getAllBlogs();
            res.status(200).json(blogs);
        });
    },
    getBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.getBlog(req.params.id);
            if (!blog) {
                res.status(404).json({
                    errorsMessages: [{ field: 'id', message: 'Blog not found' }]
                });
                return;
            }
            res.status(200).json(blog);
        });
    },
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = yield blogs_repository_1.blogsRepository.createBlog(req.body);
            res.status(201).json(newBlog);
        });
    },
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body);
            // Если репозиторий вернул ошибки, отправляем 404 с описанием
            if (errors) {
                res.status(404).json({ errorsMessages: errors });
                return;
            }
            // Если всё успешно, отправляем 204
            res.status(204).send();
        });
    },
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
            // Если репозиторий вернул ошибки, отправляем 404 с описанием
            if (errors) {
                res.status(404).json({ errorsMessages: errors });
                return;
            }
            // Если всё успешно, отправляем 204
            res.status(204).send();
        });
    }
};
