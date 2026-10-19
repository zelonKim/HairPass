import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.emptyText}>아직 등록된 즐겨찾기가 없습니다.</Text>
      <Text style={styles.subText}>
        자주 찾는 미용실을 즐겨찾기에 추가해 보세요!
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#868E96",
  },
});
