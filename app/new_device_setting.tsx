import React, { useState } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";

export default function CreationForm() {
  const [humidity, setHumidity] = useState({ value: "", error: "" });
  const [incubationDuration, setIncubationDuration] = useState({
    value: "",
    error: "",
  });
  const [name, setName] = useState({ value: "", error: "" });
  const [temperature, setTemperature] = useState({ value: "", error: "" });

  const onCreatePressed = () => {
    const nameError = name.value ? null : "A configuração precisa de um nome";
    if (nameError) {
      setName({ ...name, error: nameError });
      return;
    }
  };

  return (
    <View style={styles.container}>
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

      <Button title="Submit" onPress={onCreatePressed} />
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
});
