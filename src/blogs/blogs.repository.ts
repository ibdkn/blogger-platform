import { BlogType } from './blogs.types';
import {blogDB} from "../db/blogs.db";

export const blogsRepository = {
    getAllBlogs(): BlogType[] {
        return blogDB;
    },
    getBlog(id: string): BlogType | undefined {
        return blogDB.find(blog => blog.id === id);
    }
}