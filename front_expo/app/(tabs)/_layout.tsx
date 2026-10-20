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
        tabBarActiveTintColor: Colors.point, // 활성화된 탭 색상 (원하는 액센트 컬러로 변경 가능)
        tabBarInactiveTintColor: "#8E8E93", // 비활성화된 탭 색상
        tabBarStyle: {
          bottom: Platform.OS === "ios" ? "3%" : "5%",
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: Colors.card,
          height: 65,
          elevation: 0, // 안드로이드 기본 그림자(Elevation) 제거
          shadowOpacity: 0, // iOS 그림자 투명도 초기화
          shadowColor: "transparent", // iOS 그림자 색상 제거
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* 1. 홈 탭 (Store) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",

          tabBarIcon: ({ color, size }) => (
            <Store color={color} size={22} strokeWidth={2} />
          ),
        }}
      />

      {/* 2. 예약 현황 탭 (Zap - 실시간/자동화 느낌) */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "예약 내역",
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={22} strokeWidth={2} />
          ),
        }}
      />

      {/* 3. 즐겨찾기 탭 (Bookmark) */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "즐겨찾기",
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={22} strokeWidth={2} />
          ),
        }}
      />

      {/* 4. 설정 탭 (User) */}
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
