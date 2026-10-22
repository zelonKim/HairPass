import Colors from "@/constants/Colors";
import { TODAY_STR } from "@/constants/TODAY_STR";
import { DateModalProps } from "@/types/booking/DateModalProps";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DateSelectModal({
  visible,
  onClose,
  isCurrentMonth,
  handlePrevMonth,
  handleNextMonth,
  currentYear,
  currentMonth,
  calendarDays,
  bookingDate,
  onSelectDate,
}: DateModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.modalContent}
        >
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
              const isPast = item.dateString < TODAY_STR;
              const isSelected = bookingDate === item.dateString;

              return (
                <TouchableOpacity
                  key={item.dateString}
                  style={[
                    styles.calendarCell,
                    isSelected && styles.calendarCellSelected,
                  ]}
                  disabled={isPast}
                  onPress={() => onSelectDate(item.dateString)}
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

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>닫기</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

/////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
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
    fontWeight: "500",
    color: Colors.primary,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 14,
  },
  modalCloseButton: {
    paddingVertical: 14,
    marginTop: 18,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.subText,
  },

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
});
