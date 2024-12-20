import {config} from 'dotenv';
config();

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        AUTH: '/auth',
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments',
        TESTING: '/testing/all-data',
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'blogger-platform',
    JWT_SECRET: process.env.JWT_SECRET || 'secret_key',
    JWT_TIME: process.env.JWT_TIME || '1h',
    EMAIL: process.env.EMAIL as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
}