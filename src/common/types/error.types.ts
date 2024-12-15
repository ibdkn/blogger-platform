import {ExtensionType} from "../result/result.type";
import {HttpStatuses} from "./httpStatuses";
import {ResultStatus} from "../result/resultCode";

export type ValidationErrorType = {
    field?: string;
    message: string;
};

export class AppError extends Error {
    status: ResultStatus;
    message: string;
    extensions: ExtensionType[];
    data: any

    constructor(status: ResultStatus, message: string, extensions: ExtensionType[], data: any = null) {
        super();
        this.status = status;
        this.message = message;
        this.extensions = extensions;
        this.data = data;
        this.name = 'AppError';
    }
}