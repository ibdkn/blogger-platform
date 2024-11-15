import express, {Router} from 'express';
import cors from 'cors';
import {SETTINGS} from "./settings";
import {blogsRouter} from "./blogs/blogs.router";
import {postsRouter} from "./posts/posts.router";

export const app = express();
app.use(express.json());
app.use(cors());

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);