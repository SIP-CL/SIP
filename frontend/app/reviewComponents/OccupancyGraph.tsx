import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Helper function to sort times like 7am, 8am, ..., 5pm, 6pm
const sortHours = (hours: string[]) => {
  const hourToNumber = (h: string) => {
    const match = h.match(/^(\d+)(?::(\d+))?(am|pm)$/);
    if (!match) return 0;
    let hour = parseInt(match[1]); // 7
    let minute = match[2] ? parseInt(match[2]) : 0; // 30 if :30 exists, otherwise 0
    const ampm = match[3]; // am / pm

    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    return hour * 60 + minute; // Total minutes since midnight
  };

  return [...hours].sort((a, b) => hourToNumber(a) - hourToNumber(b));
};

interface OccupancyChartProps {
  occupancyData: {
    [day: string]: {
      [hour: string]: number; // e.g., '7am': 30
    };
  };
}

const OccupancyChart: React.FC<OccupancyChartProps> = ({ occupancyData }) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const availableDays = daysOfWeek.filter((day) =>
    Object.keys(occupancyData).includes(day)
  );

  const todayIndex = new Date().getDay();
  const today = daysOfWeek[todayIndex];

  const [selectedDay, setSelectedDay] = useState(
    availableDays.includes(today) ? today : availableDays[0]
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dataForDay = occupancyData[selectedDay] || {};

  // Extract labels (hours) and values
  const labelsUnsorted = Object.keys(dataForDay);
  const labels = sortHours(labelsUnsorted);

  const values = labels.map((hour) => {
    const hourData = dataForDay[hour];
    return hourData && typeof hourData.crowdedness === "number"
      ? hourData.crowdedness
      : 0;
  });

  // Prepare data for react-native-chart-kit
  const chartData = {
    labels: labels.filter((_, index) => {
      const totalLabels = labels.length;
      const maxLabels = 6;
      const interval = Math.ceil(totalLabels / maxLabels);
      return index % interval === 0;
    }),
    datasets: [
      {
        data: values.filter((_, index) => {
          const totalLabels = labels.length;
          const maxLabels = 6;
          const interval = Math.ceil(totalLabels / maxLabels);
          return index % interval === 0;
        }),
        color: (opacity = 1) => `rgba(60, 117, 30, ${opacity})`, // #3C751E
        strokeWidth: 2,
      },
    ],
  };

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown */}
      <View style={styles.dropdownWrapper}>
        <Pressable
          style={styles.dropdownWrapper}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.projectedText}>
            Projected: <Text style={styles.selectedDayText}>{selectedDay}</Text>{" "}
            ⌄
          </Text>
        </Pressable>
      </View>

      {/* Modal Dropdown */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={availableDays}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => handleSelectDay(item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth * 0.9}
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(60, 117, 30, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#3C751E",
            },
            propsForBackgroundLines: {
              strokeDasharray: "5,5",
              stroke: "#e0e0e0",
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    width: "100%",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  dropdownWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  dropdownButton: {
    flex: 1,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdownList: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    width: 180,
    maxHeight: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  projectedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000", // black or dark gray
  },

  selectedDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333", // slightly lighter gray if you want
  },
});

export default OccupancyChart;
