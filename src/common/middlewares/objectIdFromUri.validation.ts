import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";

export const validateObjectIdFromUri = (req: Request, res: Response, next: NextFunction) => {
    const {blogId} = req.body;

    if (!ObjectId.isValid(blogId)) {
        res.status(400).json({
            errorsMessages: [{field: 'id', message: 'Invalid ObjectId'}],
        });
        return;
    }

    next();
}