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
import { getUserIncubatorSettings } from "../../graphql/queries/userIncubatorSettings";
import { useSession } from "../../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";

type IncubatorSettingType = {
  __typename: string;
  assignedDevices: { uniqueId: string; name: string }[]; // Substitua 'any' pelo tipo apropriado se os dispositivos atribuídos tiverem uma estrutura conhecida
  humidity: number;
  id: string;
  incubationDuration: number;
  name: string;
  temperature: number;
};

export default function DeviceSettingsScreen() {
  const sessionInfo = useSession();
  const [refreshing, setRefreshing] = useState(false);

  if (!sessionInfo || !sessionInfo.session) {
    return <Text>Session info not available</Text>;
  }
  const { session } = sessionInfo;
  const [data, setData] = useState<IncubatorSettingType[]>([]);

  const fetchIncubatorsSettings = async () => {
    try {
      const response = await getUserIncubatorSettings(
        parseInt(session.user.id)
      );
      setData(response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchIncubatorsSettings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchIncubatorsSettings().then(() => setRefreshing(false));
  }, []);

  const scrollViewRef = useRef<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prédefinições</Text>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {data ? (
          data.map((setting, index) => (
            <View key={index} style={styles.settingItem}>
              <Text>ID: {setting.id}</Text>
              <Text>Nome: {setting.name}</Text>
              <Text>Temperatura: {setting.temperature}°C</Text>
              <Text>Humidade: {setting.humidity}</Text>
              <Text>
                Duração da Incubação: {setting.incubationDuration} horas
              </Text>

              <Text>
                Em uso por:{" "}
                {setting?.assignedDevices?.length !== 0
                  ? setting?.assignedDevices.map((device, index) => (
                      <View>
                        <Text>{device.name}</Text>
                      </View>
                    ))
                  : "Nenhm"}
              </Text>
              {/* Outras informações que deseja exibir */}
            </View>
          ))
        ) : (
          <Text>Nenhum dispositivo</Text>
        )}
      </ScrollView>
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={styles.signOutButton} onPress={() => {}}>
          <Text
            style={styles.signOutText}
            onPress={() => {
              router.push("/new_device_setting");
            }}>
            NOVA PREDEFINIÇÃO
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
