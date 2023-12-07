import { gql } from "@apollo/client";
import client from "../../apolloClient"; // Seu Apollo Client

export const INCUBATOR_DEVICE = gql`
  query getDevice($uniqueId: String!) {
    incubatorDevice(uniqueId: $uniqueId) {
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
`;

export const getIncubatorDevice = async (uniqueId: string) => {
  try {
    const response = await client.mutate({
      mutation: INCUBATOR_DEVICE,
      variables: { uniqueId },
    });
    return response.data.incubatorDevice;
  } catch (error: any) {
    console.log(error.toString());
  }
};
