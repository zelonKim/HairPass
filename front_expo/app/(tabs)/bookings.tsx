import { client } from "@/api/client";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
  Scissors,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
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
  booking_date: string;
  booking_time: string;
  designer_name: string;
  menu_name: string;
  payment_method: "NPAY" | "ONSITE" | string;
  status: "PENDING" | "CONFIRMED" | "FAILED" | string;
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

  const handleDeleteBooking = (bookingId: number) => {
    Alert.alert("예약 삭제", "해당 예약을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        style: "destructive",
        onPress: async () => {
          try {
            await client.delete(`/api/bookings/${bookingId}/`);
            refetch();
          } catch (error) {
            console.log("예약 삭제 실패:", error);
            Alert.alert("오류", "예약 삭제 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const handleOpenNaverBooking = async () => {
    const naverBookingUrl =
      "https://m.place.naver.com/my/timeline?tab=RESERVATION";

    try {
      const supported = await Linking.canOpenURL(naverBookingUrl);
      if (supported) {
        await Linking.openURL(naverBookingUrl);
      } else {
        console.error("열 수 없는 URL입니다:", naverBookingUrl);
      }
    } catch (error) {
      console.error("링크 열기 실패:", error);
    }
  };

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
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => handleDeleteBooking(item.id)} // 👈 꾹 눌렀을 때 삭제 다이얼로그 호출
      >
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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        {/* 💡 캘린더 아이콘 + 헤더 타이틀 가로 묶음 */}
        <View style={styles.titleRow}>
          <CalendarDays
            size={24}
            color={Colors.primary}
            style={styles.titleIcon}
          />
          <Text style={styles.headerTitle}>나의 예약 내역</Text>
        </View>

        {/* 오른쪽 네이버 예약 외부 링크 버튼 */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row", // 요소를 가로로 배치
    justifyContent: "space-between", // 양 끝으로 정렬 (왼쪽: 타이틀, 오른쪽: 버튼)
    alignItems: "center", // 수직 가운데 정렬
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
    backgroundColor: Colors.card, // 깔끔한 회색빛 배경
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
    flexDirection: "row", // 아이콘과 글자 가로 정렬
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 6, // 아이콘과 '나의 예약 내역' 글자 사이 간격
  },
});
