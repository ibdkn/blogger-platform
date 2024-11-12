"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const blogs_db_1 = require("../db/blogs.db");
exports.blogsRepository = {
    getAllBlogs() {
        return blogs_db_1.blogs;
    },
    getBlog(id) {
        return blogs_db_1.blogs.find(blog => blog.id === id);
    }
};
