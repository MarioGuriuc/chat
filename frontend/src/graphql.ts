import { gql } from '@apollo/client';

export const THEORIES = gql`
  query Theories($page: Int, $size: Int, $status: Status, $keyword: String, $hot: Boolean) {
    theories(page: $page, size: $size, status: $status, keyword: $keyword, hot: $hot) {
      content {
        id
        title
        content
        status
        postedAt
        evidenceUrls
        commentCount
        displayAuthor
        anonymous
        author { id username }
        comments {
          id
          content
          postedAt
          anonymous
          displayAuthor
          author { id username }
        }
      }
      totalElements
      totalPages
      page
      size
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $secretCode: String!) {
    login(username: $username, secretCode: $secretCode) {
      token
      user { id username }
    }
  }
`;

export const ADD_THEORY = gql`
  mutation AddTheory($input: TheoryInput!) {
    addTheory(input: $input) {
      id
      title
      status
      commentCount
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($input: CommentInput!) {
    addComment(input: $input) {
      id
      content
      displayAuthor
      postedAt
    }
  }
`;
