import {ExtensionType} from "../result/result.type";
import {HttpStatuses} from "./httpStatuses";
import {ResultStatus} from "../result/resultCode";

export type ValidationErrorType = {
    field?: string;
    message: string;
};

// todo выпилить, когда заменим на AppError
export class DomainError extends Error {
    status: number
    errorMessages: ValidationErrorType[]
    constructor(status: number, errorMessages: ValidationErrorType[]) {
        super();
        this.status = status;
        this.errorMessages = errorMessages;
        this.name = 'DomainError';
    }
}

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