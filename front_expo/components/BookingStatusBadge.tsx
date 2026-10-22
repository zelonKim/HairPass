import Colors from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

export const BookingStatusBadge = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return (
        <View style={[styles.badge, { backgroundColor: "#E5F7EC" }]}>
          <Text style={[styles.badgeText, { color: Colors.primary }]}>
            예약 확정
          </Text>
        </View>
      );
    case "PENDING":
      return (
        <View style={[styles.badge, { backgroundColor: "#FEF3C7" }]}>
          <Text style={[styles.badgeText, { color: "#D97706" }]}>
            예약 대기
          </Text>
        </View>
      );

    case "FAILED":
      return (
        <View style={[styles.badge, { backgroundColor: "#FEE2E2" }]}>
          <Text style={[styles.badgeText, { color: "#EF4444" }]}>
            예약 실패
          </Text>
        </View>
      );
    default:
      return (
        <View style={[styles.badge, { backgroundColor: Colors.primaryLight }]}>
          <Text style={[styles.badgeText, { color: Colors.primary }]}>
            {status}
          </Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
