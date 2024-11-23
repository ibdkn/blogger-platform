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
exports.blogsRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
exports.blogsRepository = {
    getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_1.blogsCollection
                .find({})
                .toArray();
            // Преобразуем каждый документ
            return blogs.map((blog) => ({
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            }));
        });
    },
    getBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Преобразуем строку id в ObjectId
            const blog = yield db_1.blogsCollection
                .findOne({ _id: new mongodb_1.ObjectId(id) });
            if (blog) {
                // Преобразуем _id в id и возвращаем нужный формат
                return {
                    id: blog._id.toString(),
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: blog.isMembership,
                };
            }
            else {
                return null;
            }
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const result = yield db_1.blogsCollection
                .insertOne(blog);
            // Проверяем, что вставка прошла успешно, и формируем объект результата
            if (result.acknowledged) {
                return {
                    id: result.insertedId.toString(), // Преобразуем _id в строку
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: blog.isMembership
                };
            }
            else {
                throw new Error('Failed to create a blog');
            }
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.getBlog(id);
            // Если блог не найден, возвращаем массив ошибок
            if (!blog)
                return [{ field: 'id', message: 'Blog not found' }];
            // Обновляем свойства блога
            const result = yield db_1.blogsCollection
                .updateOne({ _id: new mongodb_1.ObjectId(id) }, // Условие поиска
            {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                    isMembership: body.isMembership
                }
            });
            // Если ничего не обновлено, возвращаем ошибку
            if (result.matchedCount === 0) {
                return [{ field: 'id', message: 'Blog not found' }];
            }
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.getBlog(id);
            // Если блог не найден, возвращаем массив ошибок
            if (!blog)
                return [{ field: 'id', message: 'Blog not found' }];
            // Если блог найден, то удаляем его из бд
            const result = yield db_1.blogsCollection
                .deleteOne({ _id: new mongodb_1.ObjectId(id) });
            if (result.deletedCount === 0) {
                return [{ field: 'id', message: 'Blog was not deleted' }];
            }
        });
    }
};
