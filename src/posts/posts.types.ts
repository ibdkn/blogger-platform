export type PostType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};

// Для представления данных на клиенте с `id`
export type PostViewModelType = {
    id: string;
} & PostType;

// Если в представлении нужно исключить поле createdAt
export type PostViewModelTypeWithoutCreatedAt = {
    id: string;
} & Omit<PostType, 'createdAt'>;