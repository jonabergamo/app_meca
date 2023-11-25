import { gql } from "@apollo/client";
import client from "../../apolloClient"; // Seu Apollo Client

export const AUTH_TOKEN = gql`
  mutation MyMutation {
    tokenAuth(email: String!, password: String!) {
      token
      user {
        email
        firstName
        id
        isStaff
        lastName
        username
      }
    }
  }
`;

export const authenticateUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: AUTH_TOKEN,
      variables: { email, password },
    });
    console.log(data);
    return data;
  } catch (error) {}
};
