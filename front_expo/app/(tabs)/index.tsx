import { saveTokenToServer } from "@/api/common/saveTokenToServer";
import { getFavorites } from "@/api/favorite/getFavorites";
import { getUserProfile } from "@/api/user/getUserProfile";
import DateSelectModal from "@/components/DateSelectModal";
import TimeSelectModal from "@/components/TimeSelectModal";
import Colors from "@/constants/Colors";
import { THIS_MONTH } from "@/constants/THIS_MONTH";
import { THIS_YEAR } from "@/constants/THIS_YEAR";
import { useCreateBooking } from "@/hooks/booking/useCreateBooking";
import { FavoriteData } from "@/types/favorite/FavoriteData";
import { UserProfile } from "@/types/user/UserProfile";
import { getDaysInMonth } from "@/utils/getDaysInMonth";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { Calendar, Clock, Store } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification:
    async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowBanner: true,
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowList: true,
    }),
});

/////////////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////////////

  const [currentYear, setCurrentYear] = useState(THIS_YEAR);
  const [currentMonth, setCurrentMonth] = useState(THIS_MONTH);

  const calendarDays = getDaysInMonth(currentYear, currentMonth);
  const isCurrentMonth =
    currentYear === THIS_YEAR && currentMonth === THIS_MONTH;

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
    const maxYear = THIS_YEAR + 1;
    if (currentYear >= maxYear && currentMonth >= THIS_MONTH) return;
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /////////////////////////////////////////////////////////////////////

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        saveTokenToServer(token);
      }
    });
  }, []);

  /////////////////////////////////////////////////////////////////////

  const { data: favData } = useQuery<FavoriteData>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  useEffect(() => {
    if (favData) {
      setSalonName(favData.favorite_salon || "");
      setDesignerName(favData.favorite_designer || "");
      setMenuName(favData.favorite_menu || "");
    }
  }, [favData]);

  /////////////////////////////////////////////////////////////////////

  const { data: userInfo } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getUserProfile,
  });

  /////////////////////////////////////////////////////////////////////

  const { mutate: createBookingMutation, isPending: createBookingPending } =
    useCreateBooking();

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

    if (!userInfo?.naver_id || !userInfo?.naver_pw) {
      Alert.alert(
        "네이버 계정 연동 필요",
        "자동 예약을 위해 최초 1회 네이버 계정 연동이 필요합니다.",
        [
          { text: "취소", style: "cancel" },
          {
            text: "연동하기",
            onPress: () => {
              router.push("/(auth)/naver-account");
            },
          },
        ],
      );
      return;
    }

    createBookingMutation({
      salon_name: salonName,
      designer_name: designerName,
      menu_name: menuName,
      booking_date: bookingDate,
      booking_time: bookingTime,
      payment_method: paymentMethod,
    });
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleRow}>
            <Store size={24} color={Colors.primary} style={styles.titleIcon} />
            <Text style={styles.title}>미용실 예약 요청</Text>
          </View>
          <Text style={styles.subtitle}>
            AI 에이전트가 대신 미용실을 예약해 줄게요.
          </Text>
        </View>

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
            <Calendar
              size={18}
              color={bookingDate ? Colors.text : Colors.subText}
              style={styles.inputIcon}
            />
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
            <Clock
              size={18}
              color={bookingTime ? Colors.text : Colors.subText}
              style={styles.inputIcon}
            />
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
            disabled={createBookingPending}
            activeOpacity={0.8}
          >
            {createBookingPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>미용실 예약 요청하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DateSelectModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        isCurrentMonth={isCurrentMonth}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        currentYear={currentYear}
        currentMonth={currentMonth}
        calendarDays={calendarDays}
        bookingDate={bookingDate}
        onSelectDate={(dateString) => {
          setBookingDate(dateString);
          setDateModalVisible(false);
        }}
      />

      <TimeSelectModal
        visible={timeModalVisible}
        onClose={() => setTimeModalVisible(false)}
        bookingTime={bookingTime}
        onSelectTime={(time) => {
          setBookingTime(time);
          setTimeModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

/////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.subText,
    marginTop: 12,
    marginBottom: 6,
  },
  headerContainer: {
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  titleIcon: {
    marginRight: 8,
    marginBottom: 6,
  },
  inputTouchField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.input,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  nonSelectText: {
    fontSize: 14,
    color: Colors.muted,
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
    fontSize: 13.5,
    color: Colors.subText,
  },
  formCard: {
    backgroundColor: Colors.card,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
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
    fontWeight: "500",
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
});
