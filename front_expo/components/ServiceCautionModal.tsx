import { ServiceModalProps } from "@/types/common/ServiceModalProps";
import { AlertTriangle, Ban, CheckCircle2 } from "lucide-react-native";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const cautionItems = [
  {
    title: "실제 예약 확인",
    description:
      "실제 예약 여부는 최종적으로 반드시 네이버 예약 페이지를 통해 확인하여야 하며, 이를 확인하지 않아 생긴 불이익은 본인의 책임입니다.",
    icon: <CheckCircle2 size={20} color="#F59E0B" />,
  },
  {
    title: "예약 취소 및 변경",
    description:
      "확정된 예약의 취소 및 변경은 네이버 예약 페이지를 통해 직접 진행해 주셔야 합니다.",
    icon: <AlertTriangle size={20} color="#F59E0B" />,
  },
  {
    title: "예약 실패",
    description:
      "이미 예약이 찼거나, 해당 디자이너가 근무하지 않는 날짜 및 시간에 예약을 요청할 경우, 예약에 실패할 수 있습니다.",
    icon: <Ban size={20} color="#F59E0B" />,
  },
];

/////////////////////////////////////////////////////////////////////

export default function ServiceCautionModal({
  visible,
  onClose,
}: ServiceModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>⚠️ 서비스 이용 주의사항</Text>
            <Text style={styles.modalSubtitle}>
              서비스 이용 전에 아래 내용을 필독해주세요.
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={true}
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {cautionItems.map((item, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <View style={styles.textContainer}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <Pressable style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>확인</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    maxHeight: "100%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: Platform.OS === "ios" ? 13 : 12.5,
    color: "#6B7280",
  },
  scrollArea: {
    marginBottom: 12,
  },
  scrollContentContainer: {
    paddingBottom: 4,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB", 
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FEF9C3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: Platform.OS === "ios" ? 13 : 12.5,
    color: "#4B5563",
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
});
