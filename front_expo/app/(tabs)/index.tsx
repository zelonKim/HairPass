import { client } from "@/api/client";
import Colors from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateBookingPayload {
  salon_name: string;
  designer_name: string;
  menu_name: string;
  booking_date: string;
  booking_time: string;
  payment_method: "NPAY" | "ONSITE";
}

const createBooking = async (data: CreateBookingPayload) => {
  const response = await client.post("/api/bookings/", data);
  return response.data;
};

// 🗓️ 캘린더 생성 도우미
const getDaysInMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days: ({ dateString: string; dayNum: number } | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= lastDate; d++) {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(d).padStart(2, "0");
    days.push({
      dateString: `${year}-${monthStr}-${dayStr}`,
      dayNum: d,
    });
  }
  return days;
};

// ⏰ 오전 / 오후 30분 단위 타임슬롯 정의
const amSlots = ["10:00", "10:30", "11:00", "11:30"];
const pmSlots = [
  "12:00",
  "12:30",
  "1:00",
  "1:30",
  "2:00",
  "2:30",
  "3:00",
  "3:30",
  "4:00",
  "4:30",
  "5:00",
  "5:30",
  "6:00",
  "6:30",
  "7:00",
  "7:30",
  "8:00",
  "8:30",
];

export default function HomeScreen() {
  const router = useRouter();

  const [salonName, setSalonName] = useState("");
  const [designerName, setDesignerName] = useState("");
  const [menuName, setMenuName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"NPAY" | "ONSITE">("NPAY");

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const calendarDays = getDaysInMonth(currentYear, currentMonth);
  const isCurrentMonth =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

  const handlePrevMonth = () => {
    if (isCurrentMonth) return;
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const maxYear = today.getFullYear() + 1;
    if (currentYear >= maxYear && currentMonth >= today.getMonth()) return;
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      if (data.status === "need_more_info") {
        Alert.alert("정보 부족", data.message);
        return;
      }
      Alert.alert("예약 신청 완료", "AI 에이전트가 예약을 시작합니다. 🤖", [
        {
          text: "확인",
          onPress: () => {
            router.push("/(tabs)/bookings");
          },
        },
      ]);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "서버와 통신 중 문제가 발생했습니다.";
      Alert.alert("오류 발생", errorMessage);
    },
  });

  const handleSubmit = () => {
    if (
      !salonName ||
      !designerName ||
      !menuName ||
      !bookingDate ||
      !bookingTime
    ) {
      Alert.alert("알림", "예약 정보를 모두 입력해 주세요");
      return;
    }

    bookingMutation.mutate({
      salon_name: salonName,
      designer_name: designerName,
      menu_name: menuName,
      booking_date: bookingDate,
      booking_time: bookingTime, // "14:00" 형태의 string 그대로 전송
      payment_method: paymentMethod,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>HairPass 예약 요청 💈</Text>
        <Text style={styles.subtitle}>
          AI 에이전트가 대신 미용실을 예약해 드립니다.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>미용실 이름</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.muted}
            value={salonName}
            onChangeText={setSalonName}
            placeholder="예) 박준뷰티랩 청담점"
          />

          <Text style={styles.label}>담당 디자이너</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.muted}
            value={designerName}
            onChangeText={setDesignerName}
            placeholder="예) 한별쌤"
          />

          <Text style={styles.label}>시술 메뉴</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.muted}
            value={menuName}
            onChangeText={setMenuName}
            placeholder="예) 뿌리염색"
          />

          <Text style={styles.label}>예약 날짜</Text>
          <TouchableOpacity
            style={styles.inputTouchField}
            onPress={() => setDateModalVisible(true)}
            activeOpacity={0.8}
          >
            {bookingDate ? (
              <Text style={styles.inputText}>{bookingDate}</Text>
            ) : (
              <Text style={styles.nonSelectText}>날짜를 선택해주세요.</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>예약 시간</Text>
          <TouchableOpacity
            style={styles.inputTouchField}
            onPress={() => setTimeModalVisible(true)}
            activeOpacity={0.8}
          >
            {bookingTime ? (
              <Text style={styles.inputText}>{bookingTime}</Text>
            ) : (
              <Text style={styles.nonSelectText}>시간을 선택해주세요.</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>결제 수단</Text>
          <View style={styles.paymentContainer}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "NPAY" && styles.paymentSelected,
              ]}
              onPress={() => setPaymentMethod("NPAY")}
            >
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === "NPAY" && styles.paymentTextSelected,
                ]}
              >
                네이버 페이
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "ONSITE" && styles.paymentSelected,
              ]}
              onPress={() => setPaymentMethod("ONSITE")}
            >
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === "ONSITE" && styles.paymentTextSelected,
                ]}
              >
                카드 및 현금
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={bookingMutation.isPending}
            activeOpacity={0.8}
          >
            {bookingMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>미용실 예약 요청하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------------- 🗓️ 캘린더 형태 날짜 모달 ---------------- */}
      <Modal
        visible={dateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDateModalVisible(false)}
      >
        {/* 1. 바깥 배경 터치 시 모달 닫기 */}
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDateModalVisible(false)}
        >
          {/* 2. 내부 콘텐츠를 누를 때는 이벤트 전파 방지 */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            {/* 상단 월 네비게이션 헤더 */}
            <View style={styles.calendarHeader}>
              {!isCurrentMonth ? (
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  style={styles.navButton}
                >
                  <Text style={styles.navButtonText}>◀</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.navButtonPlaceholder} />
              )}
              <Text style={styles.modalTitle}>
                {currentYear}년 {currentMonth + 1}월
              </Text>
              <TouchableOpacity
                onPress={handleNextMonth}
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>▶</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekHeader}>
              {["일", "월", "화", "수", "목", "금", "토"].map((week, idx) => (
                <Text
                  key={week}
                  style={[
                    styles.calendarWeekText,
                    idx === 0 && { color: "#EF4444" },
                    idx === 6 && { color: "#3B82F6" },
                  ]}
                >
                  {week}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((item, index) => {
                if (!item) {
                  return (
                    <View key={`empty-${index}`} style={styles.calendarCell} />
                  );
                }
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                const isPast = item.dateString < todayStr;
                const isSelected = bookingDate === item.dateString;

                return (
                  <TouchableOpacity
                    key={item.dateString}
                    style={[
                      styles.calendarCell,
                      isSelected && styles.calendarCellSelected,
                    ]}
                    disabled={isPast}
                    onPress={() => {
                      setBookingDate(item.dateString);
                      setDateModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.calendarCellText,
                        isSelected && styles.calendarCellTextSelected,
                        isPast && styles.calendarCellTextDisabled,
                      ]}
                    >
                      {item.dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setDateModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ---------------- ⏰ 30분 단위 오전/오후 시간 선택 모달 ---------------- */}
      <Modal
        visible={timeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTimeModalVisible(false)}
      >
        {/* 1. 바깥 배경을 TouchableOpacity로 감싸고 터치 시 모달 닫기 */}
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTimeModalVisible(false)}
        >
          {/* 2. 내부 콘텐츠를 누를 때는 터치 이벤트가 배경으로 전파되지 않도록 차단 */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>예약 시간 선택</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 400 }}
            >
              {/* 오전 섹션 */}
              <Text style={styles.timeSectionTitle}>오전</Text>
              <View style={styles.timeGrid}>
                {amSlots.map((t) => {
                  const isSelected = bookingTime === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.timeSlotCell,
                        isSelected && styles.timeSlotCellSelected,
                      ]}
                      onPress={() => {
                        setBookingTime(t);
                        setTimeModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          isSelected && styles.timeSlotTextSelected,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 오후 섹션 */}
              <Text style={[styles.timeSectionTitle, { marginTop: 16 }]}>
                오후
              </Text>
              <View style={styles.timeGrid}>
                {pmSlots.map((t) => {
                  const isSelected = bookingTime === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.timeSlotCell,
                        isSelected && styles.timeSlotCellSelected,
                      ]}
                      onPress={() => {
                        setBookingTime(t);
                        setTimeModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          isSelected && styles.timeSlotTextSelected,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseButton, { marginTop: 16 }]}
              onPress={() => setTimeModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.subText,
    marginBottom: 20,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.subText,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  inputTouchField: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 14,
    color: Colors.text,
  },

  nonSelectText: {
    fontSize: 14,
    color: Colors.muted,
  },
  paymentContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 24,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  paymentSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  paymentText: {
    fontSize: 13,
    color: Colors.subText,
  },
  paymentTextSelected: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* 모달 공통 스타일 */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    width: 36,
    alignItems: "center",
  },
  navButtonPlaceholder: {
    width: 36,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  modalCloseButton: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.subText,
  },

  /* 캘린더 스타일 */
  calendarWeekHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  calendarWeekText: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: Colors.subText,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarCell: {
    width: "14.28%",
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    marginVertical: 2,
  },
  calendarCellSelected: {
    backgroundColor: Colors.primary,
  },
  calendarCellText: {
    fontSize: 14,
    color: Colors.text,
  },
  calendarCellTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  calendarCellTextDisabled: {
    color: "#D1D5DB",
  },

  /* 시간 Grid 스타일 */
  timeSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.subText,
    marginBottom: 8,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlotCell: {
    width: "22.5%", // 4열 배치 (30분 단위 슬롯을 예쁘게 정렬)
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    marginBottom: 4,
  },
  timeSlotCellSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  timeSlotText: {
    fontSize: 13,
    color: Colors.text,
  },
  timeSlotTextSelected: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});
