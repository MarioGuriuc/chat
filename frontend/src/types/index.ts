export enum TheoryStatus {
  UNVERIFIED = 'UNVERIFIED',
  DEBUNKED = 'DEBUNKED',
  CONFIRMED = 'CONFIRMED',
}

export interface User {
  id: string;
  username: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postedAt: string;
  updatedAt: string;
}

export interface Theory {
  id: string;
  title: string;
  content: string;
  status: TheoryStatus;
  evidenceUrls: string[];
  author: User;
  comments: Comment[];
  commentCount: number;
  postedAt: string;
  updatedAt: string;
}

export interface TheoryPage {
  content: Theory[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface TheoryInput {
  title: string;
  content: string;
  status?: TheoryStatus;
  evidenceUrls?: string[];
}

export interface CommentInput {
  theoryId: string;
  content: string;
}
