"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPostDB = exports.setBlogDB = exports.db = void 0;
exports.db = {
    blogs: [],
    posts: []
};
// функции для быстрой очистки/заполнения базы данных для тестов
const setBlogDB = (dataset) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        exports.db.blogs = [
            {
                id: '1',
                name: 'Blog 1',
                description: 'First blog',
                websiteUrl: 'https://samurai-blog-1.com',
            },
            {
                id: '2',
                name: 'Blog 2',
                description: 'Second blog',
                websiteUrl: 'https://samurai-blog-2.com'
            }
        ];
        return;
    }
    // если что-то передано - то заменяем старые значения новыми
    exports.db.blogs = dataset.blogs || exports.db.blogs;
};
exports.setBlogDB = setBlogDB;
const setPostDB = (dataset) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        exports.db.posts = [
            {
                id: '1',
                title: 'Post 1',
                shortDescription: 'description for post 1',
                content: 'content for post 1',
                blogId: '1',
                blogName: 'Blog 1',
            },
            {
                id: '2',
                title: 'Post 2',
                shortDescription: 'description for post 2',
                content: 'content for post 2',
                blogId: '1',
                blogName: 'Blog 1',
            },
            {
                id: '3',
                title: 'Post 3',
                shortDescription: 'description for post 3',
                content: 'content for post 3',
                blogId: '2',
                blogName: 'Blog 2',
            },
        ];
        return;
    }
    // если что-то передано - то заменяем старые значения новыми
    exports.db.posts = dataset.posts || exports.db.posts;
};
exports.setPostDB = setPostDB;
