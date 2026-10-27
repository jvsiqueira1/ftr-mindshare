import { gql } from "@apollo/client"

export const CREATE_COMMENT = gql`
    mutation CreateComment($ideaId: String!, $data: CreateCommentInput!) {
        createComment(ideaId: $ideaId, data: $data) {
            id
            ideaId
            authorId
            content
            createdAt
            updatedAt
        }
    }
`
