import { StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import { getUserIncubatorDevices } from "../../graphql/queries/userIncubatorDevices";
import { useSession } from "../../context/AuthContext";
import { useGlobalSearchParams } from "expo-router";
import { theme } from "../../core/theme";
import { FontAwesome } from "@expo/vector-icons";
import DevicesModal from "../../components/DevicesModal";

type IncubatorDeviceType = {
  __typename: string;
  humiditySensor: number;
  isOn: boolean;
  name: string;
  startTime: any;
  temperatureSensor: number;
  uniqueId: string;
  currentSetting: {
    name: String;
    temperature: number;
    humidity: number;
    incubationDuration: number;
    id: number;
  };
};

export default function DashbaordScreen() {
  const [selectedDevice, setSelectedDevice] = useState<IncubatorDeviceType>();
  const [incubatorsDevice, setIncubatorsDevice] = useState<
    IncubatorDeviceType[]
  >([]);
  const { refresh } = useGlobalSearchParams();
  const [showModal, setShowModal] = useState(false);

  const sessionInfo = useSession();
  const [refreshing, setRefreshing] = useState(false);

  if (!sessionInfo || !sessionInfo.session) {
    return <Text>Session info not available</Text>;
  }
  const { session } = sessionInfo;

  const fetchIncubatorsDevice = async () => {
    try {
      const response = await getUserIncubatorDevices(parseInt(session.user.id));
      setIncubatorsDevice(response);

      if (!selectedDevice) {
        setSelectedDevice(response[0]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchIncubatorsDevice();
  }, [refresh]);
  return (
    <View style={styles.container}>
      {/* {incubatorsDevice.map((device, index) => (
        <Text key={index}>{device.name}</Text>
      ))} */}
      <DevicesModal
        visible={showModal}
        devices={incubatorsDevice}
        onSelect={(device) => {
          setSelectedDevice(device);
          setShowModal(false);
        }}
      />
      <View
        style={{
          display: "flex",
          gap: 2,
          width: "100%",
        }}>
        <Text>Dispositivo selecionado: </Text>
        <TouchableOpacity
          style={{
            padding: 15,
            borderColor: theme.colors.primary,
            borderWidth: 1,
            justifyContent: "space-between",
            borderRadius: 5,
            width: "100%",
            flexDirection: "row",
          }}
          onPress={() => {
            if (incubatorsDevice.length > 0) {
              setShowModal(true);
            }
          }}>
          <Text style={{ fontSize: 15 }}>
            {selectedDevice?.name || "Nenhum"}
          </Text>
          <FontAwesome name="exchange" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {selectedDevice ? (
        <View></View>
      ) : (
        <Text>Você não possui nenhum dispositivo</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
