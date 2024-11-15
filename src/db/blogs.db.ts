import {BlogType} from "../blogs/blogs.types";

// TODO: переписать структуру БД, сделать ее общей для блогов и постов!
export let blogDB: BlogType[] = [
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