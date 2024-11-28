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
exports.postsRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const blogs_repository_1 = require("../blogs/blogs.repository");
exports.postsRepository = {
    getPosts(pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection
                .find({})
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
        });
    },
    getPostsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.countDocuments({});
        });
    },
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection
                .findOne({ _id: new mongodb_1.ObjectId(id) });
            if (post) {
                // Преобразуем _id в id и возвращаем нужный формат
                return {
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                };
            }
            else {
                return null;
            }
        });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.getBlog(body.blogId);
            // Если пост не найден, возвращаем массив ошибок
            if (!blog)
                return [{ field: 'id', message: 'Blog not found' }];
            const post = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString(),
            };
            const result = yield db_1.postsCollection
                .insertOne(post);
            // Проверяем, что вставка прошла успешно, и формируем объект результата
            if (result.acknowledged) {
                return {
                    id: result.insertedId.toString(), // Преобразуем _id в строку
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                };
            }
            else {
                throw new Error('Failed to create a blog');
            }
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.getPost(id);
            // Если пост не найден, возвращаем массив ошибок
            if (!post)
                return [{ field: 'id', message: 'Post not found' }];
            const blog = yield blogs_repository_1.blogsRepository.getBlog(body.blogId);
            // Если блог не найден, возвращаем массив ошибок
            if (!blog)
                return [{ field: 'id', message: 'Blog not found' }];
            // Обновляем свойства поста
            const result = yield db_1.postsCollection
                .updateOne({ _id: new mongodb_1.ObjectId(id) }, // Условие поиска
            {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId
                }
            });
            // Если ничего не обновлено, возвращаем ошибку
            if (result.matchedCount === 0) {
                return [{ field: 'id', message: 'Post do not updated' }];
            }
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.getPost(id);
            // Если пост не найден, возвращаем массив ошибок
            if (!post)
                return [{ field: 'id', message: 'Post not found' }];
            // Если пост найден, то удаляем его из бд
            const result = yield db_1.postsCollection
                .deleteOne({ _id: new mongodb_1.ObjectId(id) });
            if (result.deletedCount === 0) {
                return [{ field: 'id', message: 'Post was not deleted' }];
            }
        });
    }
};
