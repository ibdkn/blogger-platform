import {config} from 'dotenv';
config();

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing/all-data',
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://user:user@cluster2.3kg8znt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2',
    DB_NAME: process.env.DB_NAME || 'blogger-platform'
}