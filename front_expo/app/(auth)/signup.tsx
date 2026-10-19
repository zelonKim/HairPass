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

// Django SignupSerializer 필드와 연동되는 페이로드 타입
interface SignupPayload {
  username: string;
  password: string;
}

// 회원가입 API 호출 함수
const signupApi = async (data: SignupPayload) => {
  const response = await client.post("/api/users/signup/", data);
  return response.data;
};

export default function SignupScreen() {
  const router = useRouter();

  // 기본 계정 정보
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const signupMutation = useMutation({
    mutationFn: signupApi,
    onSuccess: async (data) => {
      if (data.token) {
        await setAccessToken(data.token);
      }
      Alert.alert(
        "회원가입 완료",
        data.message || "HairPass 회원이 되신 것을 환영합니다 🤗",
        [
          {
            text: "확인",
            onPress: () => {
              router.replace("/(tabs)");
            },
          },
        ],
      );
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMsg = "회원가입 처리 중 오류가 발생했습니다.";
      if (errorData) {
        if (typeof errorData === "string") {
          errorMsg = errorData;
        } else if (errorData.username) {
          errorMsg = `이메일 오류: ${errorData.username[0]}`;
        } else if (errorData.password) {
          errorMsg = `비밀번호 오류: ${errorData.password[0]}`;
        } else if (errorData.error) {
          errorMsg = errorData.error;
        }
      }

      Alert.alert("회원가입 실패", errorMsg);
    },
  });

  const handleSignup = () => {
    // 유효성 검사
    if (!username.trim()) {
      Alert.alert("알림", "이메일을 입력해 주세요.");
      return;
    }
    if (!password) {
      Alert.alert("알림", "비밀번호를 입력해 주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    signupMutation.mutate({
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
          {/* 🌟 1. 상단 로고 & 헤더 */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>회원가입 💈</Text>
            <Text style={styles.subtitle}>
              가입하고 편리한 미용실 예약을 시작해보세요.
            </Text>
          </View>

          {/* 📝 2. 회원가입 폼 카드 */}
          <View style={styles.formCard}>
            <Text style={styles.sectionHeaderTitle}>계정 입력 정보</Text>

            {/* 이메일 (아이디) */}
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

            {/* 비밀번호 */}
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

            {/* 비밀번호 확인 */}
            <Text style={styles.label}>비밀번호 확인</Text>
            <View style={styles.inputContainer}>
              <Lock size={18} color={Colors.subText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                placeholder="비밀번호를 한번 더 입력하세요"
                placeholderTextColor={Colors.muted}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>

            {/* 가입하기 버튼 */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignup}
              disabled={signupMutation.isPending}
              activeOpacity={0.8}
            >
              {signupMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}> 시작하기</Text>
              )}
            </TouchableOpacity>

            {/* 로그인 화면 이동 */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.linkText}>
                이미 계정이 있으신가요?{" "}
                <Text style={styles.linkHighlight}>로그인하기</Text>
              </Text>
            </TouchableOpacity>
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
  content: {
    padding: 24,
    paddingBottom: 40,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
    marginLeft: 10,
  },
  logoCard: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.subText,
    textAlign: "center",
    lineHeight: 18,
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
    elevation: 3,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  sectionHeaderSubtitle: {
    fontSize: 12,
    color: Colors.subText,
    marginBottom: 12,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.subText,
    marginTop: 24,
    marginBottom: 6,
  },
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
  submitButton: {
    backgroundColor: Colors.point,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 32,
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
});
