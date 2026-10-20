import { client } from "@/api/client";
import Colors from "@/constants/Colors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  Bell,
  ChevronRight,
  FileText,
  Link2,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  UserX,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 유저 프로필 타입 정의
export interface UserProfile {
  username: string;
  push_token: string;
  naver_id: string;
  naver_pw: string;
}

// 프로필 조회 API
const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await client.get("/api/users/");
  return response.data;
};

// 회원 탈퇴 API
const withdrawAccount = async () => {
  const response = await client.delete("/api/users/withdraw/");
  return response.data;
};

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 푸시 알림 토글 상태 (로컬 스토어 등과 연동 가능)
  const [pushEnabled, setPushEnabled] = useState<boolean>();

  // 1. 유저 정보 조회 (username 표시용)
  const { data: userInfo, isLoading } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: fetchUserProfile,
  });

  // 네이버 연동 초기화(쿠키 삭제) 뮤테이션
  const resetNaverAccountMutation = useMutation({
    mutationFn: async () => {
      await client.delete("/api/users/naver-account/");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      router.push("/(auth)/naver-login");
    },
    onError: (error) => {
      console.error("네이버 연동 해제 실패:", error);
      Alert.alert(
        "오류",
        "기존 네이버 연동 정보를 초기화하는 중 문제가 발생했습니다.",
      );
    },
  });

  const handlePressNaverLink = () => {
    // 이미 연동된 계정이 존재하는 경우, 재연동 의사를 물어볼 수 있습니다.
    if (userInfo?.naver_id && userInfo?.naver_pw) {
      Alert.alert(
        "네이버 계정 재연동",
        "이미 연동된 네이버 계정이 있습니다. 새로운 계정을 연동하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "재연동하기",
            onPress: () => resetNaverAccountMutation.mutate(),
          },
        ],
      );
    } else {
      // 연동된 적이 없다면 곧바로 로그인 페이지로 이동
      router.push("/(auth)/naver-login");
    }
  };

  // 2. 로그아웃 핸들러
  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("userToken");
            queryClient.clear(); // 쿼리 캐시 초기화
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("로그아웃 중 에러 발생:", error);
            Alert.alert("오류", "로그아웃 처리 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  // 3. 회원 탈퇴 Mutation
  const withdrawMutation = useMutation({
    mutationFn: withdrawAccount,
    onSuccess: async () => {
      await SecureStore.deleteItemAsync("userToken");
      queryClient.clear();
      Alert.alert("회원 탈퇴 완료", "그동안 이용해 주셔서 감사합니다.");
      router.replace("/(auth)/login");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.detail || "회원 탈퇴 처리에 실패했습니다.";
      Alert.alert("오류", errorMsg);
    },
  });

  const handleWithdraw = () => {
    Alert.alert(
      "⚠️ 회원 탈퇴",
      "탈퇴 시 모든 정보가 삭제되며 이를 복구할 수 없습니다. 정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: () => withdrawMutation.mutate(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 헤더 타이틀 */}
        <Text style={styles.headerTitle}>나의 설정</Text>

        {/* 1. 유저 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <UserIcon size={28} color={Colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userLabel}>로그인 계정</Text>
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

        {/* 2. 앱 설정 섹션 */}
        <Text style={styles.sectionHeader}>앱 설정</Text>
        <View style={styles.menuGroup}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Bell size={20} color={Colors.subText} style={styles.menuIcon} />
              <Text style={styles.menuText}>푸시 알림 수신</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
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

        {/* 3. 약관 및 정책 섹션 */}
        <Text style={styles.sectionHeader}>약관 및 정책</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                "서비스 이용약관",
                "여기에 서비스 이용약관 내용이 표시됩니다.",
              )
            }
          >
            <View style={styles.menuLeft}>
              <FileText
                size={20}
                color={Colors.subText}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>서비스 이용약관</Text>
            </View>
            <ChevronRight size={18} color={Colors.muted} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                "개인정보처리방침",
                "여기에 개인정보처리방침 내용이 표시됩니다.",
              )
            }
          >
            <View style={styles.menuLeft}>
              <ShieldCheck
                size={20}
                color={Colors.subText}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>개인정보처리방침</Text>
            </View>
            <ChevronRight size={18} color={Colors.muted} />
          </TouchableOpacity>
        </View>

        {/* 4. 계정 관리 섹션 */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 20,
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
