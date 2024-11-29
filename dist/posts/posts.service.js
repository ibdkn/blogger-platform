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
exports.postsService = void 0;
const posts_repository_1 = require("./posts.repository");
const blogs_repository_1 = require("../blogs/blogs.repository");
exports.postsService = {
    getPosts(pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield posts_repository_1.postsRepository.getPosts(pageNumber, pageSize, sortBy, sortDirection);
            const postsCount = yield posts_repository_1.postsRepository.getPostsCount();
            return {
                pageCount: Math.ceil(postsCount / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: postsCount,
                items: posts
            };
        });
    },
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.getPost(id);
        });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Проверяем существование блога
            const blog = yield blogs_repository_1.blogsRepository.getBlog(body.blogId);
            if (!blog) {
                throw new Error('Blog not found');
            }
            // Формируем данные для поста
            const post = Object.assign(Object.assign({}, body), { blogId: blog.id, blogName: blog.name, createdAt: new Date().toISOString() });
            return yield posts_repository_1.postsRepository.createPost(post);
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repository_1.postsRepository.updatePost(id, body);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.deletePost(id);
        });
    }
};
