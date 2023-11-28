import { gql } from "@apollo/client";
import client from "../../apolloClient"; // Seu Apollo Client

export const CREATE_DEVICE_SETTING = gql`
  mutation createDeviceSetting(
    $userId: Int!
    $temperature: Float!
    $incubationDuration: Int!
    $humidity: Float!
  ) {
    createIncubatorSetting(
      humidity: $humidity
      incubationDuration: $incubationDuration
      name: ""
      temperature: $temperature
      userId: $userId
    ) {
      incubatorSetting {
        name
        temperature
        incubationDuration
        id
        humidity
      }
    }
  }
`;

export const createDeviceSetting = async ({
  userId,
  temperature,
  incubationDuration,
  humidity,
}: {
  userId: number;
  temperature: number;
  incubationDuration: number;
  humidity: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: CREATE_DEVICE_SETTING,
      variables: {
        userId,
        temperature,
        incubationDuration,
        humidity,
      },
    });
    return response.data.tokenAuth;
  } catch (error) {}
};
