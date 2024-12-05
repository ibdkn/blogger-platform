export type UserType = {
    login: string,
    password: string,
    email: string
    createdAt: string
}

export type UserViewModelType = {
    id: string;
} & UserType;