import React, { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryScatter,
  VictoryAxis,
} from "victory-native";
import { View } from "react-native";
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
type MyVictoryChartProps = {
  device: IncubatorDeviceType;
  tolerance: number; // tolerância de 2%
};

// Substitua pelo seu componente
const MyVictoryChart = ({ device, tolerance }: MyVictoryChartProps) => {
  const [temperatureUpperLimit, setTemperatureUpperLimit] = useState<number>(0);
  const [temperatureLowerLimit, setTemperatureLowerLimit] = useState<number>(0);
  const [humidityUpperLimit, setHumidityUpperLimit] = useState<number>(0);
  const [humidityLowerLimit, setHumidityLowerLimit] = useState<number>(0);
  const [temperatureData, setTemperaureData] = useState([
    { x: "Temperatura", y: 0, y0: 0 },
  ]);
  const [humidityData, setHumidityData] = useState([
    { x: "Humidade", y: 0, y0: 0 },
  ]);

  useEffect(() => {
    setTemperatureUpperLimit(
      device.currentSetting.temperature * (1 + tolerance)
    );
    setTemperatureLowerLimit(
      device.currentSetting.temperature * (1 - tolerance)
    );
    setHumidityUpperLimit(device.currentSetting.humidity * (1 + tolerance));
    setHumidityLowerLimit(device.currentSetting.humidity * (1 - tolerance));
  }, [device]);

  useEffect(() => {
    setTemperaureData([
      {
        x: "Temperatura",
        y: temperatureUpperLimit,
        y0: temperatureLowerLimit,
      },
    ]);
    setHumidityData([
      { x: "Humidade", y: humidityUpperLimit, y0: humidityLowerLimit },
    ]);
  }, [
    temperatureLowerLimit,
    temperatureUpperLimit,
    humidityUpperLimit,
    humidityLowerLimit,
  ]);

  // A função de estilo verificará se o valor atual está dentro da faixa de tolerância
  const TemperatureBarStyle = {
    data: {
      fill: ({ datum }: { datum: any }) =>
        device.temperatureSensor > datum.y0 &&
        device.temperatureSensor < datum.y
          ? "green"
          : "red",
    },
  };

  const HumidityBarStyle = {
    data: {
      fill: ({ datum }: { datum: any }) =>
        device.humiditySensor > datum.y0 && device.humiditySensor < datum.y
          ? "green"
          : "red",
    },
  };

  return (
    <View
      style={{
        backgroundColor: "transparent",
        flexDirection: "row",
      }}>
      <VictoryChart domainPadding={40} width={200} height={300}>
        <VictoryBar
          data={temperatureData}
          style={TemperatureBarStyle as any}
          barWidth={100}
        />
        <VictoryScatter
          data={[{ x: "Temperatura", y: device.temperatureSensor }]}
          size={4}
          style={{
            data: { fill: "white" },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: "white" },
            ticks: { stroke: "white" },
            tickLabels: { fill: "white" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "white" },
            ticks: { stroke: "white" },
            tickLabels: { fill: "white" },
          }}
        />
      </VictoryChart>

      <VictoryChart domainPadding={40} width={200} height={300}>
        <VictoryBar
          data={humidityData}
          style={HumidityBarStyle as any}
          barWidth={100}
        />
        <VictoryScatter
          data={[{ x: "Humidade", y: device.humiditySensor }]}
          size={4}
          style={{
            data: { fill: "white" },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: "white" },
            ticks: { stroke: "white" },
            tickLabels: { fill: "white" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "white" },
            ticks: { stroke: "white" },
            tickLabels: { fill: "white" },
          }}
        />
      </VictoryChart>
    </View>
  );
};

export default MyVictoryChart;
