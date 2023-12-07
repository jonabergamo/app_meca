import { ApolloError, gql } from "@apollo/client";
import client from "../../apolloClient"; // Seu Apollo Client

export const UPDATE_DEVICE = gql`
  mutation updateDevice(
    $uniqueId: String!
    $name: String!
    $currentSettingId: Int!
  ) {
    updateIncubatorDevice(
      uniqueId: $uniqueId
      currentSettingId: $currentSettingId
      name: $name
    ) {
      incubatorDevice {
        humiditySensor
        isOn
        name
        startTime
        temperatureSensor
        uniqueId
        currentSetting {
          id
        }
      }
    }
  }
`;

export const updateDevice = async (
  uniqueId: string,
  name: string,
  currentSettingId: number
) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_DEVICE,
      variables: {
        uniqueId,
        name,
        currentSettingId,
      },
    });
    return response.data.updateIncubatorDevice;
  } catch (error: any) {
    console.log(error.toString());
  }
};
