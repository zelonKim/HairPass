import { client } from "@/api/client";
import { setAccessToken } from "@/api/token";
import Colors from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginPayload {
  username: string;
  password: string;
}

const loginApi = async (data: LoginPayload) => {
  const response = await client.post("/api/users/login/", data);
  return response.data;
};

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      if (data.token) {
        await setAccessToken(data.token);
      }
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";
      Alert.alert("로그인 실패", errorMsg);
    },
  });

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("알림", "이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    loginMutation.mutate({
      username: username.trim(),
      password,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* 🌟 1. 상단 로고 & 브랜드 헤더 */}
          <View style={styles.headerContainer}>
            <View style={styles.logoCard}>
              <Image
                source={require("@/assets/images/HairPass_icon.png")}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>HairPass</Text>
            <Text style={styles.subtitle}>나를 위한 미용실 자동 예약 비서</Text>
          </View>

          {/* 📝 2. 로그인 폼 카드 */}
          <View style={styles.formCard}>
            <Text style={styles.label}>이메일</Text>
            <View style={styles.inputContainer}>
              <Mail size={18} color={Colors.subText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="example@naver.com"
                placeholderTextColor={Colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.inputContainer}>
              <Lock size={18} color={Colors.subText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={Colors.muted}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLogin}
              disabled={loginMutation.isPending}
              activeOpacity={0.8}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>로그인하기</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text style={styles.linkText}>
                아직 계정이 없으신가요?{" "}
                <Text style={styles.linkHighlight}>회원가입</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🤝 3. 소셜 로그인 (네이버 + 애플) */}
          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>간편 로그인</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtonsContainer}>
              {/* 네이버 로그인 */}
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#03C75A" }]}
                onPress={() =>
                  Alert.alert("알림", "네이버 로그인 준비 중입니다.")
                }
                activeOpacity={0.85}
              >
                <Text style={styles.naverText}>N</Text>
                <Text style={styles.socialButtonText}>네이버로 로그인하기</Text>
              </TouchableOpacity>

              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: "#000000" }]}
                  onPress={() =>
                    Alert.alert("알림", "Apple 로그인 준비 중입니다.")
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.appleText}></Text>
                  <Text style={styles.socialButtonText}>
                    Apple로 로그인하기
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  // 입력창을 감싸는 컨테이너 (가로 배치)
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.input,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: Colors.text,
  },
  content: {
    padding: 24,
    justifyContent: "center",
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 26,
  },
  /* 로고 아이콘 카드 스타일 업그레이드 */
  logoCard: {
    width: 92,
    height: 92,
    borderRadius: 24,
    backgroundColor: Colors.background,
    padding: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // 입체감 있는 그림자
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.pointDark,
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.subText,
    textAlign: "center",
    marginBottom: 16,
  },
  /* 배지 스타일 */
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
  },

  submitButton: {
    backgroundColor: Colors.point,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    fontSize: 13,
    color: Colors.subText,
  },
  linkHighlight: {
    color: Colors.point,
    fontWeight: "bold",
  },
  /* 소셜 로그인 섹션 */
  socialSection: {
    marginTop: 28,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: Colors.muted,
  },
  socialButtonsContainer: {
    flexDirection: "column",

    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  naverText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
  appleText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 20,
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
