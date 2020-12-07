import { ApolloClient, InMemoryCache, ApolloProvider, useMutation, gql, createHttpLink, useQuery, split, useSubscription, useLazyQuery } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { createUploadLink } from 'apollo-upload-client';
import cache from './cache';

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WS,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${Cookies.get('echat:token') || ''}`,
    }
  }
});

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_API,
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const link = onError(({ graphQLErrors, networkError, operation, response }) => {
    
  if (["onGetConsumer", "onWigetLogIn"].indexOf(operation.operationName) > -1) {
    return response.errors = null;
  }

  if (graphQLErrors){
    
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
    toast.warning(graphQLErrors[0].message, { position: 'top-center' })
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get('echat:token') || null;
  // return the headers to the context so httpLink can read them

  if(token)
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  
  return {
    headers
  }
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

const typePolicies = {
  Query: {
    fields: {
      roomMessages: {
        keyArgs: false,
        merge(existing = [], incoming) {
          
         console.log(existing, incoming)
          return existing
        },
      }
    }
  }
}



const client = new ApolloClient({
  link: authLink.concat(link).concat(splitLink),
  cache,
  defaultOptions
});

export {
  ApolloProvider,
  useMutation,
  useQuery,
  useSubscription,
  gql,
  cache,
  useLazyQuery
}

export default client