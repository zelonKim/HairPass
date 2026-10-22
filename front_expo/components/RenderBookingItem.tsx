import Colors from "@/constants/Colors";
import { useDeleteBooking } from "@/hooks/booking/useDeleteBooking";
import { Booking } from "@/types/booking/Booking";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Scissors,
} from "lucide-react-native";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BookingStatusBadge } from "./BookingStatusBadge";

export const RenderBookingItem = ({ item }: { item: Booking }) => {
  const { mutate: BookingDeleteMutation } = useDeleteBooking();

  const confirmAndDelete = (bookingId: number) => {
    Alert.alert("예약 삭제", "해당 예약을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        style: "destructive",
        onPress: () => {
          BookingDeleteMutation(bookingId);
        },
      },
    ]);
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={() => confirmAndDelete(item.id)}
    >
      <View style={styles.card}>
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
          {BookingStatusBadge(item.status)}
        </View>

        <View style={styles.divider} />

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

/////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
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
});
