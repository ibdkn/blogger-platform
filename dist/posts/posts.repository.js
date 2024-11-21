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
exports.postsRepository = {
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection
                .find({})
                .toArray();
        });
    },
    // getPost(id: string): PostType | undefined {
    //     return db.posts.find(post => post.id === id);
    // },
    // createPost(title: string,
    //            shortDescription: string,
    //            content: string,
    //            blogId: string
    // ): PostType | Array<{ field: string; message: string }> {
    //     const blog: BlogType | undefined = blogsRepository.getBlog(blogId);
    //
    //     // Если пост не найден, возвращаем массив ошибок
    //     if (!blog) return [{field: 'id', message: 'Blog not found'}];
    //
    //     const newPost: PostType = {
    //         id: `${Date.now()}-${Math.random()}`,
    //         title,
    //         shortDescription,
    //         content,
    //         blogId,
    //         blogName: blog.name
    //     };
    //
    //     db.posts.push(newPost);
    //     return newPost;
    // },
    // updatePost(
    //     id: string,
    //     newTitle: string,
    //     newShortDescription: string,
    //     newContent: string,
    //     newBlogId: string
    // ): Array<{ field: string; message: string }> | void {
    //     const post: PostType | undefined = this.getPost(id);
    //
    //     // Если пост не найден, возвращаем массив ошибок
    //     if (!post) return [{field: 'id', message: 'Post not found'}];
    //
    //     const blog: BlogType | undefined = blogsRepository.getBlog(newBlogId);
    //
    //     // Если блог не найден, возвращаем массив ошибок
    //     if (!blog) return [{field: 'id', message: 'Blog not found'}];
    //
    //     // Обновляем свойства поста
    //     post.title = newTitle;
    //     post.shortDescription = newShortDescription;
    //     post.content = newContent;
    //     post.blogId = newBlogId;
    //     post.blogName = blog.name;
    //
    //     // Если всё успешно, ничего не возвращаем
    // },
    // deletePost(id: string): Array<{ field: string; message: string }> | void {
    //     const post: PostType | undefined = this.getPost(id);
    //
    //     // Если пост не найден, возвращаем массив ошибок
    //     if (!post) return [{field: 'id', message: 'Post not found'}];
    //
    //     db.posts = db.posts.filter(post => post.id !== id);
    // }
};
