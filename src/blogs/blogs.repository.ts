import { BlogType } from './blogs.types';
import {db} from "../db/db";

export const blogsRepository = {
    getAllBlogs(): BlogType[] {
        return db.blogs;
    },
    getBlog(id: string): BlogType | undefined {
        return db.blogs.find(blog => blog.id === id);
    },
    createBlog(name: string, description: string, websiteUrl: string): BlogType {
        const newBlog: BlogType = {
            id: `${Date.now()}-${Math.random()}`,
            name,
            description,
            websiteUrl
        };

        db.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id: string, newName: string, newDescription: string, newWebsiteUrl: string): Array<{ field: string; message: string }> | void {
        const blog: BlogType | undefined = this.getBlog(id);

        // Если блог не найден, возвращаем массив ошибок
        if (!blog) return [{ field: 'id', message: 'Blog not found' }];

        // Обновляем свойства блога
        blog.name = newName;
        blog.description = newDescription;
        blog.websiteUrl = newWebsiteUrl;

        // Если всё успешно, ничего не возвращаем
    },
    deleteBlog(id: string): Array<{ field: string; message: string }> | void {
        const blog: BlogType | undefined = this.getBlog(id);

        // Если блог не найден, возвращаем массив ошибок
        if (!blog) return [{ field: 'id', message: 'Blog not found' }];

        // Если блог найден, то удаляем его из бд
        db.blogs = db.blogs.filter(blog => blog.id === id);

        // Если всё успешно, ничего не возвращаем
    }
}