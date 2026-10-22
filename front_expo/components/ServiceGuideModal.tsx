import { ServiceModalProps } from "@/types/common/ServiceModalProps";
import { Bell, ExternalLink, Sparkles, UserCheck } from "lucide-react-native";
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

const guideSteps = [
  {
    step: "01",
    title: "네이버 계정 연동",
    description: "설정 탭에서 본인의 네이버 계정을 연동해주세요.",
    icon: <UserCheck size={20} color="#3B82F6" />,
  },
  {
    step: "02",
    title: "예약 정보 입력 & 요청",
    description: "홈탭에서 원하는 예약 정보를 입력 후, 예약을 요청하세요.",
    icon: <Sparkles size={20} color="#3B82F6" />,
  },
  {
    step: "03",
    title: "예약 성공 알림 대기",
    description: "AI 에이전트의 예약 성공 알림을 기다려주세요.",
    icon: <Bell size={20} color="#3B82F6" />,
  },
  {
    step: "04",
    title: "네이버 예약 페이지 접속",
    description: "네이버 예약 페이지에 들어가 실제 예약 내역을 확인해주세요.",
    icon: <ExternalLink size={20} color="#3B82F6" />,
  },
];

/////////////////////////////////////////////////////////////////////

export default function ServiceGuideModal({
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
            <Text style={styles.modalTitle}>💡 서비스 이용 방법</Text>
            <Text style={styles.modalSubtitle}>
              HairPass를 더욱 스마트하게 이용하는 방법
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollArea}
          >
            {guideSteps.map((item, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <View style={styles.textContainer}>
                  <View style={styles.stepTitleRow}>
                    <Text style={styles.stepNumber}>{item.step}</Text>
                    <Text style={styles.stepTitle}>{item.title}</Text>
                  </View>
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
    padding: 23,
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
    marginBottom: 24,
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
  stepCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3B82F6",
    marginRight: 6,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
  },
  stepDescription: {
    fontSize: Platform.OS === "ios" ? 13 : 12.5,
    color: "#4B5563",
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: "#3B82F6",
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
