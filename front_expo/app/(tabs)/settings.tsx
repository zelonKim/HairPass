import { removeAccessToken } from "@/api/token";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  // 로그아웃
  const onPressLogout = async () => {
    await removeAccessToken();
    router.replace("/(auth)/login");
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까? ", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: onPressLogout,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.profileName}>김성진 님</Text>
        <Text style={styles.profileEmail}>tsyirvo@example.com</Text>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>네이버 / 카카오 계정 연동</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>알림 설정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>고객센터 및 문의</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
  },
  profileEmail: {
    fontSize: 14,
    color: "#868E96",
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E9ECEF",
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  menuText: {
    fontSize: 15,
    color: "#343A40",
  },
  logoutText: {
    fontSize: 15,
    color: "#ff2714",
  },
});
