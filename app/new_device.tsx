import React, { useState, useEffect } from "react";
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

  const [name, setName] = useState({ value: "", error: "" });
  const [currentSetting, setCurrentSetting] = useState({
    value: "",
    error: "",
  });
  const [incubatorsSettings, setIncubatorsSettings] = useState<IncubatorSettingType[]>([]);
  const [selectedSetting, setSelectedSetting] = useState({
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
  }, []);


  const onCreatePressed = async () => {
    const nameError = name.value ? null : "A configuração precisa de um nome";
    const currentSettingError = currentSetting.value
      ? null
      : "Você precisa escolher uma configuração";

    if (
      nameError ||
      currentSettingError ||

    ) {
      setName({ ...name, error: nameError || "" });
      setCurrentSetting({ ...currentSetting, error: currentSettingError || "" });
    }
    try {
      const response = await createDevice(
        parseInt(session.user.id),
        name.value,
        selectedSetting
      );
      if (response) {
        Toast.show("Configuração criada com sucesso", toastSettings);

        // Limpar campos
        setName({ value: "", error: "" });
        setHumidity({ value: "", error: "" });
        setTemperature({ value: "", error: "" });
        setIncubationDuration({ value: "", error: "" });

        // Redirecionar para a página desejada
        router.push("/(user-routes)/devices_settings");
      }
    } catch (err: any) {
      ToastAndroid.show(
        `Um erro ocorreu ${err.toString()}`,
        ToastAndroid.SHORT
      );
    }
  };

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
      <TextInput
        description=""
        label="Humidade (kg/m³)"
        returnKeyType="next"
        labelStyle={{ color: theme.colors.primary }}
        value={humidity.value}
        onChangeText={(text: string) => setHumidity({ value: text, error: "" })}
        error={!!humidity.error}
        errorText={humidity.error}
        autoCapitalize="none"
        autoCompleteType="name"
        textContentType="name"
        keyboardType="decimal-pad"
      />
      <TextInput
        description=""
        label="Temperatura (Graus Celcius)"
        returnKeyType="next"
        labelStyle={{ color: theme.colors.primary }}
        value={temperature.value}
        onChangeText={(text: string) =>
          setTemperature({ value: text, error: "" })
        }
        error={!!temperature.error}
        errorText={temperature.error}
        autoCapitalize="none"
        autoCompleteType="name"
        textContentType="name"
        keyboardType="decimal-pad"
      />
      <TextInput
        description=""
        label="Tempo de incubação (horas)"
        returnKeyType="next"
        labelStyle={{ color: theme.colors.primary }}
        value={incubationDuration.value}
        onChangeText={(text: string) =>
          setIncubationDuration({ value: text, error: "" })
        }
        error={!!incubationDuration.error}
        errorText={incubationDuration.error}
        autoCapitalize="none"
        autoCompleteType="name"
        textContentType="name"
        keyboardType="decimal-pad"
      />
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
    width: 300,
    height: 300,
    marginBottom: 8,
  },
});
