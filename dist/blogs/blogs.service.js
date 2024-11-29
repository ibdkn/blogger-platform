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
exports.blogsService = void 0;
const blogs_repository_1 = require("./blogs.repository");
const posts_repository_1 = require("../posts/posts.repository");
exports.blogsService = {
    getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield blogs_repository_1.blogsRepository.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
            const blogsCount = yield blogs_repository_1.blogsRepository.getBlogsCount(searchNameTerm);
            return {
                pageCount: Math.ceil(blogsCount / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: blogsCount,
                items: blogs
            };
        });
    },
    getBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.getBlog(blogId);
        });
    },
    getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield posts_repository_1.postsRepository.getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);
            const postsCount = yield posts_repository_1.postsRepository.getPostsByIdCount(blogId);
            return {
                pageCount: Math.ceil(postsCount / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: postsCount,
                items: posts
            };
        });
    },
    createPost(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Проверяем существование блога
            const blog = yield blogs_repository_1.blogsRepository.getBlog(blogId);
            if (!blog) {
                throw new Error('Blog not found');
            }
            // Формируем данные для поста
            const post = Object.assign(Object.assign({}, body), { blogId, blogName: blog.name, createdAt: new Date().toISOString() });
            // Сохраняем пост
            return posts_repository_1.postsRepository.createPost(post);
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.createBlog(body);
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.updateBlog(id, body);
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.deleteBlog(id);
        });
    }
};
