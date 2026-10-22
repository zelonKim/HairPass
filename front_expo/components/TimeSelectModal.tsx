import { AM_SLOT } from "@/constants/AM_SLOT";
import Colors from "@/constants/Colors";
import { PM_SLOT } from "@/constants/PM_SLOT";
import { TimeModalProps } from "@/types/booking/TimeModalProps";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TimeSelectModal({
  visible,
  onClose,
  bookingTime,
  onSelectTime,
}: TimeModalProps) {
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
          <Text style={styles.modalTitle}>예약 시간 선택</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 400 }}
          >
            <Text style={styles.timeSectionTitle}>오전</Text>
            <View style={styles.timeGrid}>
              {AM_SLOT.map((t) => {
                const isSelected = bookingTime === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeSlotCell,
                      isSelected && styles.timeSlotCellSelected,
                    ]}
                    onPress={() => onSelectTime(t)}
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

            <Text style={[styles.timeSectionTitle, { marginTop: 24 }]}>
              오후
            </Text>
            <View style={styles.timeGrid}>
              {PM_SLOT.map((t) => {
                const isSelected = bookingTime === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeSlotCell,
                      isSelected && styles.timeSlotCellSelected,
                    ]}
                    onPress={() => onSelectTime(t)}
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
            onPress={onClose}
          >
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

  timeSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.subText,
    marginVertical: 12,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlotCell: {
    width: "22.5%",
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
