import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs } from "expo-router";
import { Pressable, Text, View, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { useSession } from "../../context/AuthContext";
import DeviceFill from "../../components/icons/DeviceFill";
import DashboardFill from "../../components/icons/DashboardFill";
import DeviceSettingsFill from "../../components/icons/DeviceSettingsFill";
import AccountFill from "../../components/icons/AccountFill";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function PrivateLayout() {
  const colorScheme = useColorScheme();
  const sessionInfo = useSession();

  if (!sessionInfo) {
    // Lidar com o caso em que sessionInfo é null
    return <Text>Session info not available</Text>;
  }

  const { session, isLoading } = sessionInfo;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="./login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Painel de Controle",
          tabBarIcon: ({ color }) => <DashboardFill color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: "Dispositivos",
          tabBarIcon: ({ color }) => <DeviceFill color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="devices_settings"
        options={{
          title: "Pré Definições",
          tabBarIcon: ({ color }) => <DeviceSettingsFill color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Minha Conta",
          tabBarIcon: ({ color }) => <AccountFill color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
