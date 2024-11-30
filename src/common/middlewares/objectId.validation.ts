import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id || req.params.blogId;

    if (!ObjectId.isValid(id)) {
        res.status(400).json({
            errorsMessages: [{message: 'Invalid ObjectId'}],
        });
        return;
    }

    next();
}