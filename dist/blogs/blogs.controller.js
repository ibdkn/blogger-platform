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
const mongodb_1 = require("mongodb");
const blogs_service_1 = require("./blogs.service");
const pagination_helper_1 = require("../helpers/pagination.helper");
const posts_service_1 = require("../posts/posts.service");
exports.blogsController = {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = (0, pagination_helper_1.paginationQueries)(req);
            const blogs = yield blogs_service_1.blogsService.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
            res.status(200).json(blogs);
        });
    },
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            const { pageNumber, pageSize, sortBy, sortDirection } = (0, pagination_helper_1.paginationPostQueries)(req);
            // Передаем параметры в сервис
            const posts = yield posts_service_1.postsService.getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);
            res.status(200).json(posts);
        });
    },
    getBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            // Проверяем валидность ObjectId
            if (!mongodb_1.ObjectId.isValid(blogId)) {
                res.status(400).json({
                    errorsMessages: [{ field: 'id', message: 'Invalid ObjectId' }],
                });
                return;
            }
            const blog = yield blogs_repository_1.blogsRepository.getBlog(blogId);
            if (!blog) {
                res.status(404).json({
                    errorsMessages: [{ field: 'id', message: 'Blog not found' }]
                });
                return;
            }
            res.status(200).json(blog);
        });
    },
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const blogId = req.params.id;
            // Проверяем валидность ObjectId
            if (!mongodb_1.ObjectId.isValid(blogId)) {
                res.status(400).json({
                    errorsMessages: [{ field: 'id', message: 'Invalid ObjectId' }],
                });
                return;
            }
            const errors = yield blogs_repository_1.blogsRepository.updateBlog(blogId, req.body);
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
            const blogId = req.params.id;
            // Проверяем валидность ObjectId
            if (!mongodb_1.ObjectId.isValid(blogId)) {
                res.status(400).json({
                    errorsMessages: [{ field: 'id', message: 'Invalid ObjectId' }],
                });
                return;
            }
            const errors = yield blogs_repository_1.blogsRepository.deleteBlog(blogId);
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
