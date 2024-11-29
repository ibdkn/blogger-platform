import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;

    if (!ObjectId.isValid(id)) {
        res.status(400).json({
            errorsMessages: [{field: 'id', message: 'Invalid ObjectId'}],
        });
        return;
    }

    next();
}