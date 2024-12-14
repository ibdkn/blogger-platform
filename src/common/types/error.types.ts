export type ValidationErrorType = {
    field?: string;
    message: string;
};

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