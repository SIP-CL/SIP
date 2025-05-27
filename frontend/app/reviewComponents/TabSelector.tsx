import React, {useState} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type TabType = 'Menu' | 'Info' | 'Reviews';

interface TabSelectorProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    setTabLayouts: React.Dispatch<React.SetStateAction<{ [key in TabType]?: { x: number; width: number } }>>;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setActiveTab, setTabLayouts }) => {

    return (
      <View style={styles.tabContainer}>
        {(['Menu', 'Info', 'Reviews'] as TabType[]).map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                setTabLayouts(prev => ({ ...prev, [tab]: { x, width } }));
              }}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
          >
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };
  
 const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 20,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
      },
      tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: 4,
        backgroundColor: '#d6e8d2',
      },
      activeTab: {
        backgroundColor: 'transparent',
        borderRightColor: '#ccc',
        borderLeftColor: '#ccc',
        borderTopColor: '#ccc',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
      },
      tabText: {
        color: '#444',
        fontWeight: '500',
      },
      activeTabText: {
        color: '#000',
        fontWeight: '700',
      },
 })

export default TabSelector;
