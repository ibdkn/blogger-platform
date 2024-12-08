export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
};

export type BlogViewModelType = {
    id: string
} & BlogType

export type BlogEntityModelType = {
    _id: string
} & BlogType