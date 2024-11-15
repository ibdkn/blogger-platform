"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../db/db");
exports.blogsRepository = {
    getAllBlogs() {
        return db_1.db.blogs;
    },
    getBlog(id) {
        return db_1.db.blogs.find(blog => blog.id === id);
    },
    createBlog(name, description, websiteUrl) {
        const newBlog = {
            id: `${Date.now()}-${Math.random()}`,
            name,
            description,
            websiteUrl
        };
        db_1.db.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id, newName, newDescription, newWebsiteUrl) {
        const blog = this.getBlog(id);
        // Если блог не найден, возвращаем массив ошибок
        if (!blog)
            return [{ field: 'id', message: 'Blog not found' }];
        // Обновляем свойства блога
        blog.name = newName;
        blog.description = newDescription;
        blog.websiteUrl = newWebsiteUrl;
        // Если всё успешно, ничего не возвращаем
    },
    deleteBlog(id) {
        const blog = this.getBlog(id);
        // Если блог не найден, возвращаем массив ошибок
        if (!blog)
            return [{ field: 'id', message: 'Blog not found' }];
        // Если блог найден, то удаляем его из бд
        db_1.db.blogs = db_1.db.blogs.filter(blog => blog.id === id);
        // Если всё успешно, ничего не возвращаем
    }
};
