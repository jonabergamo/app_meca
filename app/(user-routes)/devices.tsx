import { RefreshControl, StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { theme } from "../../core/theme";
import { router } from "expo-router";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSession } from "../../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { getUserIncubatorDevices } from "../../graphql/queries/userIncubatorDevices";

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

export default function DeviceScreen() {
  const sessionInfo = useSession();
  const [refreshing, setRefreshing] = useState(false);

  if (!sessionInfo || !sessionInfo.session) {
    return <Text>Session info not available</Text>;
  }
  const { session } = sessionInfo;
  const [data, setData] = useState<IncubatorDeviceType[]>([]);

  const fetchIncubatorsDevice = async () => {
    try {
      const response = await getUserIncubatorDevices(parseInt(session.user.id));
      setData(response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchIncubatorsDevice();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchIncubatorsDevice().then(() => setRefreshing(false));
  }, []);

  const scrollViewRef = useRef<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispositivos</Text>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {data &&
          data.map((device, index) => (
            <View key={index} style={styles.settingItem} >
              <Text>Nome: {device.name}</Text>
              <Text>Estado: {device?.isOn ? "Ligado" : "Desligado"}</Text>
              <Text>Sensor de Humidade: {device.humiditySensor}</Text>
              <Text>Sesnor de Temperatura: {device.temperatureSensor}°C</Text>
              <Text>
                Hora de inicio da incubação: {device?.startTime !== null ? device?.startTime : 'Não iniciado'}
              </Text>

              <Text></Text>
              {/* Outras informações que deseja exibir */}
            </View>
          ))}
      </ScrollView>
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={styles.signOutButton} onPress={() => {}}>
          <Text
            style={styles.signOutText}
            onPress={() => {
              router.push("/new_device");
            }}>
            NOVO DISPOSITIVO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={() => {}}>
          <Text
            style={styles.signOutText}
            onPress={() => {
              onRefresh();
            }}>
            RECARREGAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", // Alterado para space-between
    marginTop: 25,
    paddingVertical: 20, // Espaçamento vertical
  },
  scrollView: {
    width: "100%", // Garante que a ScrollView ocupe toda a largura
    flex: 1,
  },
  settingItem: {
    marginBottom: 15, // Espaçamento entre os itens
    backgroundColor: "#202123",
    padding: 10,
    borderRadius: 10,
    fontSize: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 15,
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
