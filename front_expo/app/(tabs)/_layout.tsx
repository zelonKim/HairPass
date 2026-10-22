import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { CalendarDays, Heart, Store, UserRoundCog } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.point,
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          bottom: Platform.OS === "ios" ? "4%" : "6%",
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: Colors.card,
          height: Platform.OS === "ios" ? 55 : 65,
          elevation: 0,
          shadowOpacity: 0,
          shadowColor: "transparent",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarLabelStyle: {
          fontSize: Platform.OS === "ios" ? 11.5 : 9,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",

          tabBarIcon: ({ color, size }) => (
            <Store color={color} size={22} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: "예약 내역",
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={22} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "즐겨찾기",
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={22} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({ color, size }) => (
            <UserRoundCog color={color} size={22} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
