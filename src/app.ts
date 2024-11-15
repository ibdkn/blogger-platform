import express, {Request, Response} from 'express'
import cors from 'cors';
import {SETTINGS} from "./settings";
import {blogsRouter} from "./blogs/blogs.router";
import {postsRouter} from "./posts/posts.router";
import {testingRouter} from "./testing/testing.router";

export const app = express();
app.use(express.json());
app.use(cors());

// app.get('/', (req: Request, res: Response) => {
//     // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
//     res.status(200).json('Welcome to blogger-platform')
// })

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);