"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const blogs_db_1 = require("../db/blogs.db");
exports.blogsRepository = {
    getAllBlogs() {
        return blogs_db_1.blogDB;
    },
    getBlog(id) {
        return blogs_db_1.blogDB.find(blog => blog.id === id);
    },
    createBlog(name, description, websiteUrl) {
        const newBlog = {
            id: `${Date.now()}-${Math.random()}`,
            name,
            description,
            websiteUrl
        };
        blogs_db_1.blogDB.push(newBlog);
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
        // TODO: сейчас мутируем массив, удаляя блог, но потом перепишем структуру бд и изменим этот код
        const index = blogs_db_1.blogDB.findIndex(b => b.id === id);
        if (index !== -1) {
            blogs_db_1.blogDB.splice(index, 1);
        }
        // Если всё успешно, ничего не возвращаем
    }
};
