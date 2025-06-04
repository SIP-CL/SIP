import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import HomeIcon from "../../assets/images/home.svg";
import ProfileIcon from "../../assets/images/profile.svg";
import FeedIcon from "../../assets/images/feed.svg";
import ListIcon from "../../assets/images/list.svg";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3C751E",
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <HomeIcon width={24} height={24} fill="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="Feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <FeedIcon width={24} height={24} fill="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="List"
        options={{
          title: "List",
          tabBarIcon: ({ color }) => (
            <ListIcon width={24} height={24} fill="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <ProfileIcon width={24} height={24} fill="white" />
          ),
        }}
      />
    </Tabs>
  );
}
