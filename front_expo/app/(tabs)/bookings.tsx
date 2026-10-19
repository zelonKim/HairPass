import { client } from "@/api/client";
import Colors from "@/constants/Colors";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  RefreshCw,
  Scissors,
} from "lucide-react-native";
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

// 1. Django Booking 모델 기반 타입 정의
export interface Booking {
  id: number;
  salon_name: string;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:MM:SS
  designer_name: string;
  menu_name: string;
  payment_method: "NPAY" | "ONSITE" | string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | "FAILED"
    | string;
  naver_booking_id?: string;
  memo?: string;
  created_at: string;
}

// 2. 예약 목록 Fetch 함수
const fetchBookings = async (): Promise<Booking[]> => {
  const response = await client.get("/api/bookings/");
  return response.data;
};

export default function BookingsScreen() {
  // 3. TanStack Query useQuery 훅
  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  // 예약 상태별 뱃지 스타일 & 라벨 렌더링
  const renderStatusBadge = (status: string) => {
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
      case "COMPLETED":
        return (
          <View style={[styles.badge, { backgroundColor: Colors.background }]}>
            <Text style={[styles.badgeText, { color: Colors.pointDark }]}>
              방문 완료
            </Text>
          </View>
        );
      case "CANCELLED":
        return (
          <View style={[styles.badge, { backgroundColor: "#FEE2E2" }]}>
            <Text style={[styles.badgeText, { color: "#EF4444" }]}>
              예약 취소
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
          <View
            style={[styles.badge, { backgroundColor: Colors.primaryLight }]}
          >
            <Text style={[styles.badgeText, { color: Colors.primary }]}>
              {status}
            </Text>
          </View>
        );
    }
  };

  // 개별 예약 아이템 카드리스트
  const renderBookingItem = ({ item }: { item: Booking }) => {
    return (
      <View style={styles.card}>
        {/* 상단: 미용실 이름 및 상태 뱃지 */}
        <View style={styles.cardHeader}>
          <View style={styles.salonTitleRow}>
            <MapPin
              size={18}
              color={Colors.pointDark}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.salonName}>
              {item.salon_name || "미용실 정보 없음"}
            </Text>
          </View>
          {renderStatusBadge(item.status)}
        </View>

        <View style={styles.divider} />

        {/* 중단: 예약 일시 / 디자이너 / 시술 메뉴 정보 */}
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Calendar
              size={15}
              color={Colors.subText}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{item.booking_date}</Text>
            <Clock
              size={15}
              color={Colors.subText}
              style={[styles.infoIcon, { marginLeft: 12 }]}
            />
            <Text style={styles.infoText}>
              {item.booking_time ? item.booking_time.substring(0, 5) : ""}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Scissors
              size={15}
              color={Colors.subText}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              {item.designer_name}쌤 / {item.menu_name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <CreditCard
              size={15}
              color={Colors.subText}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              {item.payment_method === "NPAY"
                ? "네이버페이 결제"
                : "카드 및 현금 결제"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 예약 내역</Text>
        <TouchableOpacity
          onPress={() => refetch()}
          activeOpacity={0.7}
          style={styles.refreshButton}
        >
          <RefreshCw size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* 로딩 상태 처리 */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>예약 내역을 불러오는 중...</Text>
        </View>
      ) : isError ? (
        /* 에러 상태 처리 */
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
        /* 예약 리스트 */
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  refreshButton: {
    padding: 6,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  salonTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  salonName: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
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
    paddingVertical: 80,
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
});
