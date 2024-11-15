import {PostType} from "./posts.types";
import {db} from "../db/db";
import {blogsRepository} from "../blogs/blogs.repository";
import {BlogType} from "../blogs/blogs.types";

export const postsRepository = {
    getAllPosts(): PostType[] {
        return db.posts;
    },
    getPost(id: string): PostType | undefined {
        return db.posts.find(post => post.id === id);
    },
    createPost(title: string,
               shortDescription: string,
               content: string,
               blogId: string
    ): PostType | Array<{ field: string; message: string }> {
        const blog: BlogType | undefined = blogsRepository.getBlog(blogId);

        // Если пост не найден, возвращаем массив ошибок
        if (!blog) return [{field: 'id', message: 'Blog not found'}];

        const newPost: PostType = {
            id: `${Date.now()}-${Math.random()}`,
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name
        };

        db.posts.push(newPost);
        return newPost;
    },
    updatePost(
        id: string,
        newTitle: string,
        newShortDescription: string,
        newContent: string,
        newBlogId: string
    ): Array<{ field: string; message: string }> | void {
        const post: PostType | undefined = this.getPost(id);

        // Если пост не найден, возвращаем массив ошибок
        if (!post) return [{field: 'id', message: 'Post not found'}];

        const blog: BlogType | undefined = blogsRepository.getBlog(newBlogId);

        // Если блог не найден, возвращаем массив ошибок
        if (!blog) return [{field: 'id', message: 'Blog not found'}];

        // Обновляем свойства поста
        post.title = newTitle;
        post.shortDescription = newShortDescription;
        post.content = newContent;
        post.blogId = newBlogId;
        post.blogName = blog.name;

        // Если всё успешно, ничего не возвращаем
    },
    deletePost(id: string): Array<{ field: string; message: string }> | void {
        const post: PostType | undefined = this.getPost(id);

        // Если пост не найден, возвращаем массив ошибок
        if (!post) return [{field: 'id', message: 'Post not found'}];

        db.posts = db.posts.filter(post => post.id !== id);
    }
}