// Re-export Apollo Client exports for easier importing
export {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  gql
} from '@apollo/client';

export {
  ApolloProvider,
  useQuery,
  useMutation
} from '@apollo/client/react';

export { setContext } from '@apollo/client/link/context';
