"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing/all-data',
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://user:user@cluster2.3kg8znt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2',
    DB_NAME: process.env.DB_NAME || 'blogger-platform'
};
