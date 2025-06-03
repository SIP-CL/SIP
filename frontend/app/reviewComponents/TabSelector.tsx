import React, {useState} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type TabType = 'Menu' | 'Info' | 'Reviews';

interface TabSelectorProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    // setTabLayouts: React.Dispatch<React.SetStateAction<{ [key in TabType]?: { x: number; width: number } }>>;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setActiveTab }) => {

    return (
      <View style={styles.tabContainer}>
        {(['Menu', 'Info', 'Reviews'] as TabType[]).map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
            ]}
          >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
            {activeTab === tab && <View style={styles.activeUnderline} />}
          </Pressable>
        ))}
      </View>
    );
  };
  
 const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'green',
    fontWeight: '700',
  },
  activeUnderline: {
    marginTop: 6,
    height: 3,
    width: '60%',
    backgroundColor: 'green',
    borderRadius: 2,
  },
});

export default TabSelector;
