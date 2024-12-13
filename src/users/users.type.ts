// todo выпилить
export type UserType = {
    login: string,
    password: string,
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