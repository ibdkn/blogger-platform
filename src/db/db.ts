import {Collection, MongoClient} from 'mongodb';
import {BlogType} from "../blogs/blogs.types";
import {PostType} from "../posts/posts.types";
import {SETTINGS} from "../settings";
import {UserDBType} from "../users/types/user.db.type";
import {CommentType} from "../comments/types/commment.type";

export let blogsCollection: Collection<BlogType>;
export let postsCollection: Collection<PostType>;
export let usersCollection: Collection<UserDBType>;
export let commentsCollection: Collection<CommentType>;

export const runDb = async (url: string): Promise<boolean> => {
    const client = new MongoClient(url);
    const db = client.db(SETTINGS.DB_NAME);

    blogsCollection = db.collection<BlogType>(SETTINGS.PATH.BLOGS);
    postsCollection = db.collection<PostType>(SETTINGS.PATH.POSTS);
    usersCollection = db.collection<UserDBType>(SETTINGS.PATH.USERS);
    commentsCollection = db.collection<CommentType>(SETTINGS.PATH.COMMENTS);

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