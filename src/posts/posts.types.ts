export type PostType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};

export type PostViewType = {
    id: string;
} & PostType;

export type PostEntityModelType = {
    _id: string
} & PostType