export type CommentType = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfoType,
    createdAt: string
}

type CommentatorInfoType = {
    userId: string,
    userLogin: string
}