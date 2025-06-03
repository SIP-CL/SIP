import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, Modal } from 'react-native';
import { AreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

interface OccupancyDataPoint {
  hour: string;   // e.g., '7am'
  value: number;  // e.g., 30
}

interface OccupancyChartProps {
  occupancyData: {
    [day: string]: OccupancyDataPoint[];
  };
}

const OccupancyChart: React.FC<OccupancyChartProps> = ({ occupancyData }) => {
  const availableDays = Object.keys(occupancyData);

  const todayIndex = new Date().getDay();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = daysOfWeek[todayIndex];

  const [selectedDay, setSelectedDay] = useState(
    availableDays.includes(today) ? today : availableDays[0]
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dataForDay = occupancyData[selectedDay] || [];
  const values = dataForDay.map((d) => d.value);
  const labels = dataForDay.map((d) => d.hour);

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
        <Text style={styles.title}>Projected:</Text>
        <Pressable style={styles.dropdownButton} onPress={() => setDropdownVisible(true)}>
          <Text style={styles.dropdownButtonText}>{selectedDay}</Text>
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
          {[100, 75, 50, 25].map((val) => (
            <Text key={val} style={styles.yAxisLabel}>{val}</Text>
          ))}
        </View>
        <AreaChart
          style={styles.chart}
          data={values}
          curve={shape.curveNatural}
          svg={{ fill: 'url(#gradientFill)', stroke: '#3C751E', strokeWidth: 2 }}
          contentInset={{ top: 10, bottom: 10 }}
          gridMin={0}
          gridMax={100}
          showGrid={false} // <<< removes default grid
        >
          <Gradient />
        </AreaChart>
      </View>

      {/* X-Axis Labels */}
      <View style={styles.xAxisLabels}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.xAxisLabel}>
            {label}
          </Text>
        ))}
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
    paddingHorizontal: 16,
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
});

export default OccupancyChart;
