import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, Modal } from 'react-native';
import { AreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

// Helper function to sort times like 7am, 8am, ..., 5pm, 6pm
const sortHours = (hours: string[]) => {
  const hourToNumber = (h: string) => {
    const match = h.match(/^(\d+)(?::(\d+))?(am|pm)$/);
    if (!match) return 0;
    let hour = parseInt(match[1]);       // 7
    let minute = match[2] ? parseInt(match[2]) : 0; // 30 if :30 exists, otherwise 0
    const ampm = match[3];               // am / pm

    if (ampm === 'pm' && hour !== 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;

    return hour * 60 + minute;  // Total minutes since midnight
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
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const availableDays = daysOfWeek.filter((day) => Object.keys(occupancyData).includes(day));

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
    return hourData && typeof hourData.crowdedness === 'number' ? hourData.crowdedness : 0;
  });


  const Gradient = () => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradientFill'} x1={'0'} y={'0'} x2={'0'} y2={'1'}>
        <Stop offset={'0%'} stopColor={'#3C751E'} stopOpacity={0.8} />
        <Stop offset={'100%'} stopColor={'#FFFFFF'} stopOpacity={0.2} />
      </LinearGradient>
    </Defs>
  );

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown */}
      <View style={styles.dropdownWrapper}>
        <Pressable style={styles.dropdownWrapper} onPress={() => setDropdownVisible(true)}>
          <Text style={styles.projectedText}>
            Projected: <Text style={styles.selectedDayText}>{selectedDay}</Text> ⌄
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
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
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

      {/* Chart with Y-axis labels */}
      <View style={styles.chartWithYAxis}>
        <View style={styles.yAxisLabels}>
          {[100, 75, 50, 25, 0].map((val) => (
            <Text key={val} style={styles.yAxisLabel}>{val}</Text>
          ))}
        </View>
        <AreaChart
          style={styles.chart}
          data={values}
          curve={shape.curveMonotoneX}
          svg={{ fill: 'url(#gradientFill)', stroke: '#3C751E', strokeWidth: 2 }}
          contentInset={{ top: 10, bottom: 0 }}
          gridMin={0}
          gridMax={100}
          yMin={0}  // 🔥 Set baseline to 0
          showGrid={false}
        >
          <Gradient />
        </AreaChart>

      </View>

      {/* X-Axis Labels */}
      <View style={styles.xAxisLabels}>
        {labels.map((label, index) => {
          // Only show a label if it is every Nth
          const totalLabels = labels.length;
          const maxLabels = 6; // 🔥 <- How many you want max on screen, adjust if needed
          const interval = Math.ceil(totalLabels / maxLabels);

          if (index % interval === 0) {
            return (
              <Text key={index} style={styles.xAxisLabel}>
                {label}
              </Text>
            );
          } else {
            return (
              <Text key={index} style={styles.xAxisLabel}>
                {/* Empty Text to keep spacing consistent */}
              </Text>
            );
          }
        })}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    width: '100%',
  },
  chartWithYAxis: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    height: 200,
    marginRight: 6,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666',
  },
  chart: {
    height: 200,
    width: '90%', // Adjust width to accommodate y-axis
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#666',
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  dropdownButton: {
    flex: 1,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdownList: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    width: 180,
    maxHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  projectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000', // black or dark gray
  },

  selectedDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333', // slightly lighter gray if you want
  },

});

export default OccupancyChart;
