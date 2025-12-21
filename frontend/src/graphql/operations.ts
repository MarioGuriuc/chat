import { gql } from '../apollo-imports';

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $secretCode: String!, $anonymous: Boolean) {
    login(username: $username, secretCode: $secretCode, anonymous: $anonymous) {
      user {
        id
        username
        isAnonymous
        createdAt
      }
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $secretCode: String!, $anonymous: Boolean) {
    register(username: $username, secretCode: $secretCode, anonymous: $anonymous) {
      user {
        id
        username
        isAnonymous
        createdAt
      }
      token
    }
  }
`;

export const GET_THEORIES_QUERY = gql`
  query GetTheories($page: Int, $size: Int, $status: TheoryStatus, $keyword: String, $hot: Boolean) {
    theories(page: $page, size: $size, status: $status, keyword: $keyword, hot: $hot) {
      content {
        id
        title
        content
        status
        evidenceUrls
        commentCount
        postedAt
        updatedAt
        author {
          id
          username
          isAnonymous
        }
      }
      totalElements
      totalPages
      currentPage
      size
    }
  }
`;

export const GET_THEORY_QUERY = gql`
  query GetTheory($id: ID!) {
    theory(id: $id) {
      id
      title
      content
      status
      evidenceUrls
      commentCount
      postedAt
      updatedAt
      author {
        id
        username
        isAnonymous
      }
      comments {
        id
        content
        postedAt
        updatedAt
        author {
          id
          username
          isAnonymous
        }
      }
    }
  }
`;

export const CREATE_THEORY_MUTATION = gql`
  mutation CreateTheory($input: TheoryInput!) {
    createTheory(input: $input) {
      id
      title
      content
      status
      evidenceUrls
      postedAt
      author {
        id
        username
      }
    }
  }
`;

export const UPDATE_THEORY_MUTATION = gql`
  mutation UpdateTheory($id: ID!, $input: TheoryInput!) {
    updateTheory(id: $id, input: $input) {
      id
      title
      content
      status
      evidenceUrls
      updatedAt
    }
  }
`;

export const DELETE_THEORY_MUTATION = gql`
  mutation DeleteTheory($id: ID!) {
    deleteTheory(id: $id)
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      id
      content
      postedAt
      author {
        id
        username
        isAnonymous
      }
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
      updatedAt
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      username
      isAnonymous
      createdAt
    }
  }
`;
