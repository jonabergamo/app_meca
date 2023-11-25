// apolloClient.js
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://10.109.25.87:8000/graphql",
  cache: new InMemoryCache(),
});

export default client;
