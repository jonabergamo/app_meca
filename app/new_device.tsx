import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import { theme } from "../core/theme";
import { router } from "expo-router";
import Toast from "react-native-root-toast";
import { useSession } from "../context/AuthContext";
import { createDeviceSetting } from "../graphql/mutations/createDeviceSetting";
import { toastSettings } from "../components/ToastSettings";
import TextInput from "../components/TextInput";
import { createDevice } from "../graphql/mutations/createDevice";
import { getUserIncubatorSettings } from "../graphql/queries/userIncubatorSettings";
import { Picker } from "@react-native-picker/picker"; // Importe Picker de @react-native-picker/picker
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

type IncubatorSettingType = {
  __typename: string;
  assignedDevices: { uniqueId: string; name: string }[]; // Substitua 'any' pelo tipo apropriado se os dispositivos atribuídos tiverem uma estrutura conhecida
  humidity: number;
  id: string;
  incubationDuration: number;
  name: string;
  temperature: number;
};

export default function CreationForm() {
  const sessionInfo = useSession();
  const [refreshing, setRefreshing] = useState(false);

  const [name, setName] = useState({ value: "", error: "" });

  const [incubatorsSettings, setIncubatorsSettings] = useState<
    IncubatorSettingType[]
  >([]);
  const [selectedSettingId, setSelectedSettingId] = useState({
    value: "",
    error: "",
  });

  if (!sessionInfo || !sessionInfo.session) {
    return <Text>Session info not available</Text>;
  }

  const { session, isLoading } = sessionInfo;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const fetchIncubatorsSettings = async () => {
    try {
      const response = await getUserIncubatorSettings(
        parseInt(session.user.id)
      );
      setIncubatorsSettings(response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchIncubatorsSettings();
  }, [session]);

  const onCreatePressed = async () => {
    const nameError = name.value ? null : "O dispositivo precisa de um nome";
    const selectedSettingIdError = selectedSettingId.value
      ? null
      : "Você precisa escolher uma configuração";

    if (nameError || selectedSettingIdError) {
      setName({ ...name, error: nameError || "" });
      setSelectedSettingId({
        ...selectedSettingId,
        error: selectedSettingIdError || "",
      });
    } else {
      try {
        const response = await createDevice(
          parseInt(session.user.id),
          name.value,
          parseInt(selectedSettingId.value) // Usar 'selectedSettingId' diretamente
        );
        if (response) {
          Toast.show("Configuração criada com sucesso", toastSettings);

          // Limpar campos
          setName({ value: "", error: "" });
          setSelectedSettingId({ value: "", error: "" }); // Apenas definir como string vazia

          // Redirecionar para a página desejada
          router.push("/(user-routes)/devices");
        }
      } catch (err: any) {
        ToastAndroid.show(
          `Um erro ocorreu ${err.toString()}`,
          ToastAndroid.SHORT
        );
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchIncubatorsSettings().then(() => setRefreshing(false));
  }, []);
  const scrollViewRef = useRef<any>();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/device_settings.png")}
        style={styles.image}
      />
      <TextInput
        description=""
        label="Nome"
        returnKeyType="next"
        labelStyle={{ color: theme.colors.primary }}
        value={name.value}
        onChangeText={(text: string) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
        autoCapitalize="none"
        autoCompleteType="name"
        textContentType="name"
        keyboardType="default"
      />
      <Text style={styles.topText}>Selecione a configuração desejada:</Text>
      {selectedSettingId.error && (
        <Text style={styles.error}>{selectedSettingId.error}</Text>
      )}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {incubatorsSettings ? (
          incubatorsSettings.map((setting, index) => (
            <TouchableOpacity
              key={index}
              style={{
                ...styles.settingItem,
                backgroundColor:
                  setting.id === selectedSettingId.value
                    ? theme.colors.primary
                    : "#161616",
              }}
              onPress={() => {
                setSelectedSettingId({
                  ...selectedSettingId,
                  value: setting.id,
                });
              }}>
              <Text style={styles.settingText}>ID: {setting.id}</Text>
              <Text style={styles.settingText}>Nome: {setting.name}</Text>
              <Text style={styles.settingText}>
                Temperatura: {setting.temperature}°C
              </Text>
              <Text style={styles.settingText}>
                Humidade: {setting.humidity}
              </Text>
              <Text style={styles.settingText}>
                Duração da Incubação: {setting.incubationDuration} horas
              </Text>

              <Text style={styles.settingText}>
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
            </TouchableOpacity>
          ))
        ) : (
          <View>
            <Text style={styles.settingText}>
              Nenhuma configuração encontrada, crie uma aqui
            </Text>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => {
                router.push("/new_device_setting");
              }}>
              <Text
                style={styles.sendButtonText}
                onPress={() => {
                  router.push("/new_device_setting");
                }}>
                CRIAR CONFIGURAÇÃO
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.sendButton} onPress={onCreatePressed}>
        <Text style={styles.sendButtonText} onPress={onCreatePressed}>
          CRIAR
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollView: {
    width: "100%", // Garante que a ScrollView ocupe toda a largura
    flex: 1,
  },
  topText: {
    color: "white",
    fontSize: 20,
    paddingVertical: 10,
  },
  error: { color: "red" },
  settingItem: {
    marginBottom: 15, // Espaçamento entre os itens
    padding: 10,
    borderRadius: 10,
    fontSize: 30,
    color: "white",
  },
  settingText: {
    color: "white",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    backgroundColor: "white",
  },
  sendButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
});
