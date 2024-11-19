import {Collection, MongoClient} from 'mongodb';
import {BlogType} from "../blogs/blogs.types";
import {PostType} from "../posts/posts.types";
import {SETTINGS} from "../settings";

export let blogsCollection: Collection<BlogType>;
export let postsCollection: Collection<PostType>;

export const runDb = async (url: string): Promise<boolean> => {
    const client = new MongoClient(url);
    const db = client.db(SETTINGS.DB_NAME);

    blogsCollection = db.collection<BlogType>(SETTINGS.PATH.BLOGS);
    postsCollection = db.collection<PostType>(SETTINGS.PATH.POSTS);

    try {
        // Устанавливаем соединение
        await client.connect();

        // Выполняем команду ping, чтобы проверить соединение
        await db.command({ ping: 1 });

        console.log('Connected successfully to MongoDB');
        return true;

    } catch (e) {
        console.error("Can't connect to the database", e);

        // Закрываем клиент в случае ошибки
        await client.close();
        return false;
    }
};

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