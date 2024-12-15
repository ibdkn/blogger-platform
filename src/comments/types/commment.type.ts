export type CommentType = {
    content: string,
    commentatorInfo: CommentatorInfoType,
    createdAt: string
}

type CommentatorInfoType = {
    userId: string,
    userLogin: string
}

export type CommentTypeWithPostId = {
    postId: string
} & CommentType

export type CommentViewType = {
    id: string
} & CommentType