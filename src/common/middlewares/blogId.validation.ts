import {body} from "express-validator";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../../blogs/blogs.repository";

export const blogIdValidate = body('blogId')
    .trim()
    .notEmpty().withMessage('BlogId is required')
    .custom(async (blogId) => {
        // Проверяем валидность ObjectId
        if (!ObjectId.isValid(blogId)) {
            throw new Error('Invalid ObjectId');
        }

        // Проверяем существование блога
        const blogExists = await blogsRepository.getBlog(blogId);
        if (!blogExists) {
            throw new Error('Blog does not exist');
        }

        return true;
    });