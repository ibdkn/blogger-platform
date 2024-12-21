import {body} from "express-validator";

export const confirmationCodeValidation = body('code')
    .trim()
    .notEmpty().withMessage('Code is required')
    .isString().withMessage('Code must be a string')
    .custom(async (value): Promise<boolean> => {
        const isUuid: boolean = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).test(value);

        if (!isUuid) {
            throw new Error('Invalid confirmation code');
        }

        return true;
    })