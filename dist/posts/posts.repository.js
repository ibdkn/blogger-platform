"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../db/db");
const blogs_repository_1 = require("../blogs/blogs.repository");
exports.postsRepository = {
    getAllPosts() {
        return db_1.db.posts;
    },
    getPost(id) {
        return db_1.db.posts.find(post => post.id === id);
    },
    createPost(title, shortDescription, content, blogId) {
        const blog = blogs_repository_1.blogsRepository.getBlog(blogId);
        // Если пост не найден, возвращаем массив ошибок
        if (!blog)
            return [{ field: 'id', message: 'Blog not found' }];
        const newPost = {
            id: `${Date.now()}-${Math.random()}`,
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name
        };
        db_1.db.posts.push(newPost);
        return newPost;
    },
    updatePost(id, newTitle, newShortDescription, newContent, newBlogId) {
        const post = this.getPost(id);
        // Если пост не найден, возвращаем массив ошибок
        if (!post)
            return [{ field: 'id', message: 'Post not found' }];
        const blog = blogs_repository_1.blogsRepository.getBlog(newBlogId);
        // Если блог не найден, возвращаем массив ошибок
        if (!blog)
            return [{ field: 'id', message: 'Blog not found' }];
        // Обновляем свойства поста
        post.title = newTitle;
        post.shortDescription = newShortDescription;
        post.content = newContent;
        post.blogId = newBlogId;
        post.blogName = blog.name;
        // Если всё успешно, ничего не возвращаем
    },
    deletePost(id) {
        const post = this.getPost(id);
        // Если пост не найден, возвращаем массив ошибок
        if (!post)
            return [{ field: 'id', message: 'Post not found' }];
        db_1.db.posts = db_1.db.posts.filter(post => post.id !== id);
    }
};
