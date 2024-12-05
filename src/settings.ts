import {config} from 'dotenv';
config();

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        AUTH: '/auth',
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        TESTING: '/testing/all-data',
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'blogger-platform'
}