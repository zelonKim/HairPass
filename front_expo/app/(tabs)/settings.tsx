import { removeAccessToken } from "@/api/token";
import { getUserProfile } from "@/api/user/getUserProfile";
import ServiceCautionModal from "@/components/ServiceCautionModal";
import ServiceGuideModal from "@/components/ServiceGuideModal";
import Colors from "@/constants/Colors";
import { useResetNaverAccount } from "@/hooks/auth/useResetNaverAccount";
import { useWithdrawAccount } from "@/hooks/auth/useWithdrawAccount";
import { UserProfile } from "@/types/user/UserProfile";
import { handleTogglePush } from "@/utils/handleTogglePush";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  FileText,
  Link2,
  LogOut,
  User,
  UserX,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [cautionModalVisible, setCautionModalVisible] = useState(false);
  const [pushEnabled, setPushEnabled] = useState<boolean>();

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPushEnabled(status === "granted");
    };

    checkNotificationPermission();
  }, []);

  /////////////////////////////////////////////////////////////////////

  const { data: userInfo, isLoading } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getUserProfile,
  });

  /////////////////////////////////////////////////////////////////////

  const { mutate: resetNaverAccountMutation } = useResetNaverAccount();

  const handlePressNaverLink = () => {
    if (userInfo?.naver_id && userInfo?.naver_pw) {
      Alert.alert(
        "네이버 계정 재연동",
        "이미 연동된 네이버 계정이 있습니다. 새로운 계정을 연동하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "재연동하기",
            onPress: () => resetNaverAccountMutation(),
          },
        ],
      );
    } else {
      router.push("/(auth)/naver-account");
    }
  };

  /////////////////////////////////////////////////////////////////////

  const { mutate: withdrawMutation } = useWithdrawAccount();

  const handleWithdraw = () => {
    Alert.alert(
      "⚠️ 회원 탈퇴",
      "탈퇴 시 모든 정보가 삭제되며 이를 복구할 수 없습니다. 정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: () => withdrawMutation(),
        },
      ],
    );
  };

  /////////////////////////////////////////////////////////////////////

  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await removeAccessToken();
            queryClient.clear();
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("로그아웃 중 에러 발생:", error);
            Alert.alert("오류", "로그아웃 처리 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
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
            <Text style={styles.headerTitle}>나의 설정</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={25} color={Colors.primary} style={styles.titleIcon} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userLabel}>접속중인 계정</Text>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ alignSelf: "flex-start", marginTop: 4 }}
              />
            ) : (
              <Text style={styles.userEmail}>
                {userInfo?.username || "사용자"}
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.sectionHeader}>앱 설정</Text>
        <View style={styles.menuGroup}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Bell size={20} color={Colors.warning} style={styles.menuIcon} />
              <Text style={styles.menuText}>푸시 알림 수신</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={(val) => handleTogglePush(val, setPushEnabled)}
              trackColor={{ false: Colors.muted, true: Colors.point }}
              thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePressNaverLink}
          >
            <View style={styles.menuLeft}>
              <Link2 size={20} color="#03C75A" style={styles.menuIcon} />
              <Text style={styles.menuText}>네이버 계정 연동하기</Text>
            </View>
            <Text style={styles.menuRightText}>
              {userInfo?.naver_id && userInfo?.naver_pw ? (
                <Text style={{ color: Colors.pointDark }}>연동 완료</Text>
              ) : (
                <Text style={{ color: "#EF4444" }}>미연동</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>서비스 안내</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setGuideModalVisible(true)}
          >
            <View style={styles.menuLeft}>
              <FileText
                size={20}
                color={Colors.pointDark}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>서비스 이용 방법</Text>
            </View>
            <ChevronRight size={18} color={Colors.muted} />
          </TouchableOpacity>

          <ServiceGuideModal
            visible={guideModalVisible}
            onClose={() => setGuideModalVisible(false)}
          />

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setCautionModalVisible(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={Colors.warning}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>서비스 이용 주의사항</Text>
            </View>
            <ChevronRight size={18} color={Colors.muted} />
          </TouchableOpacity>

          <ServiceCautionModal
            visible={cautionModalVisible}
            onClose={() => setCautionModalVisible(false)}
          />
        </View>

        <Text style={styles.sectionHeader}>계정 관리</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <LogOut size={20} color="#D97706" style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: "#D97706" }]}>
                로그아웃
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.muted} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleWithdraw}
          >
            <View style={styles.menuLeft}>
              <UserX size={20} color="#EF4444" style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: "#EF4444" }]}>
                회원 탈퇴
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.muted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 6,
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  logoImage: {
    width: "110%",
    height: "110%",
    borderRadius: 48,
  },
  userInfo: {
    flex: 1,
  },
  userLabel: {
    fontSize: 12,
    color: Colors.subText,
    fontWeight: "600",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.subText,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuGroup: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 36,
  },
  menuRightText: { fontSize: 14, fontWeight: "500" },
});
