import {blogs} from "../db/blogs.db";
import { BlogType } from './blogs.types';

export const blogsRepository = {
    getAllBlogs(): BlogType[] {
        return blogs;
    },
    getBlog(id: number): BlogType | undefined {
        return blogs.find(blog => blog.id === id);
    }
}