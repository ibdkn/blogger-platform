"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.postsCollection = exports.blogsCollection = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
const runDb = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    const db = client.db(settings_1.SETTINGS.DB_NAME);
    exports.blogsCollection = db.collection(settings_1.SETTINGS.PATH.BLOGS);
    exports.postsCollection = db.collection(settings_1.SETTINGS.PATH.POSTS);
    try {
        // Устанавливаем соединение
        yield client.connect();
        // Выполняем команду ping, чтобы проверить соединение
        yield db.command({ ping: 1 });
        console.log('Connected successfully to MongoDB');
        return true;
    }
    catch (e) {
        console.error("Can't connect to the database", e);
        // Закрываем клиент в случае ошибки
        yield client.close();
        return false;
    }
});
exports.runDb = runDb;
// функции для быстрой очистки/заполнения базы данных для тестов
// export const setBlogDB = (dataset?: Partial<dbType>) => {
//     if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
//         db.blogs = [
//             {
//                 id: '1',
//                 name: 'Blog 1',
//                 description: 'First blog',
//                 websiteUrl: 'https://samurai-blog-1.com',
//             },
//             {
//                 id: '2',
//                 name: 'Blog 2',
//                 description: 'Second blog',
//                 websiteUrl: 'https://samurai-blog-2.com'
//             }
//         ];
//         return;
//     }
//
//     // если что-то передано - то заменяем старые значения новыми
//     db.blogs = dataset.blogs || db.blogs;
// }
//
// export const setPostDB = (dataset?: Partial<dbType>) => {
//     if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
//         db.posts = [
//             {
//                 id: '1',
//                 title: 'Post 1',
//                 shortDescription: 'description for post 1',
//                 content: 'content for post 1',
//                 blogId: '1',
//                 blogName: 'Blog 1',
//             },
//             {
//                 id: '2',
//                 title: 'Post 2',
//                 shortDescription: 'description for post 2',
//                 content: 'content for post 2',
//                 blogId: '1',
//                 blogName: 'Blog 1',
//             },
//             {
//                 id: '3',
//                 title: 'Post 3',
//                 shortDescription: 'description for post 3',
//                 content: 'content for post 3',
//                 blogId: '2',
//                 blogName: 'Blog 2',
//             },
//         ];
//         return;
//     }
//
//     // если что-то передано - то заменяем старые значения новыми
//     db.posts = dataset.posts || db.posts;
// }
