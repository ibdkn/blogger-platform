import {BlogType} from "../../blogs/blogs.types";
import {PostType} from "../../posts/posts.types";

export type dbType = {
    blogs: BlogType[];
    posts: PostType[]
}