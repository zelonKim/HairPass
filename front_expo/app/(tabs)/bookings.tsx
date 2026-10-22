import { getBookings } from "@/api/booking/getBookings";
import { RenderBookingItem } from "@/components/RenderBookingItem";
import Colors from "@/constants/Colors";
import { Booking } from "@/types/booking/Booking";
import { handleOpenNaverBooking } from "@/utils/handleOpenNaverBooking";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingsScreen() {
  const {
    data: bookings = [],
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  /////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <CalendarDays
            size={24}
            color={Colors.primary}
            style={styles.titleIcon}
          />
          <Text style={styles.headerTitle}>나의 예약 내역</Text>
        </View>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleOpenNaverBooking}
          activeOpacity={0.7}
        >
          <Text style={styles.linkButtonText}>네이버 예약 </Text>
          <Ionicons
            name="open-outline"
            size={14}
            color="#03C75A"
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>

      {isPending ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>예약 내역을 불러오는 중...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>예약 목록을 가져올 수 없습니다.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RenderBookingItem item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                아직 예약된 내역이 없습니다.
              </Text>
              <Text style={styles.emptySubtitle}>
                홈에서 원하는 미용실을 바로 예약해보세요!
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

/////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#191F28",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 1,
    borderColor: Colors.text,
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4E5968",
  },
  iconStyle: {
    marginLeft: 4,
  },

  refreshButton: {
    padding: 6,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.subText,
  },
  errorText: {
    fontSize: 15,
    color: Colors.subText,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 240,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.subText,
    textAlign: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 6,
  },
});
