import {ObjectId} from "mongodb";

export const validateObjectId = (id: string) => {
    const errorsMessages = [];

    if (!ObjectId.isValid(id)) {
        errorsMessages.push({message: 'Invalid ObjectId'})
    }

    return errorsMessages;
}