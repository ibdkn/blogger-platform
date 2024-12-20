export type UserDBType = {
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
}

export type UserDBTypeWithConfirm = {
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: string;
        isConfirmed: boolean;
    }
}