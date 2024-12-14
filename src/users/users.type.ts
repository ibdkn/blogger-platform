export type UserType = {
    login: string,
    passwordHash: string,
    email: string
    createdAt: string
}

export type UserTypeWithoutPassword = {
    login: string,
    email: string
    createdAt: string
}

export type UserViewModelType = {
    id: string;
} & UserTypeWithoutPassword;