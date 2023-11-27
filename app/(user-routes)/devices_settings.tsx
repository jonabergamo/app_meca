import { StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { theme } from "../../core/theme";

export default function DeviceSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prédefinições</Text>
      <View></View>
      <TouchableOpacity style={styles.signOutButton} onPress={() => {}}>
        <Text style={styles.signOutText}>NOVA PREDEFINIÇÃO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
