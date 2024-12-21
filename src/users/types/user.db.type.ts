export type UserDBType = {
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
    emailConfirmation: EmailConfirmationType
}

type EmailConfirmationType = {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
}