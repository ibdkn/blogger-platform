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