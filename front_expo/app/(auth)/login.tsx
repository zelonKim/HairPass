import { loginApi } from "@/api/auth/loginApi";
import { setAccessToken } from "@/api/token";
import Colors from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Lock, UserRound } from "lucide-react-native";
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

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutate: loginMutation, isPending: loginPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      if (data.token) {
        await setAccessToken(data.token);
      }
      router.replace("/(tabs)");
    },
    onError: () => {
      const errorMsg = "아이디 혹은 비밀번호가 올바르지 않습니다.";
      Alert.alert("로그인 실패", errorMsg);
    },
  });

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("알림", "이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    loginMutation({
      username: username.trim(),
      password,
    });
  };

  /////////////////////////////////////////////////////////////////////

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
          <View style={styles.headerContainer}>
            <View style={styles.logoCard}>
              <Image
                source={require("@/assets/images/HairPass_icon.png")}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>HairPass</Text>
            <Text style={styles.subtitle}>
              나를 위한 미용실 자동 예약 에이전트
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>아이디</Text>
            <View style={styles.inputContainer}>
              <UserRound
                size={18}
                color={Colors.subText}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="아이디를 입력해주세요."
                placeholderTextColor={Colors.muted}
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, { marginTop: 24 }]}>비밀번호</Text>
            <View style={styles.inputContainer}>
              <Lock size={18} color={Colors.subText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력해주세요."
                placeholderTextColor={Colors.muted}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLogin}
              disabled={loginPending}
              activeOpacity={0.8}
            >
              {loginPending ? (
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
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginTop: 10,
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
  content: {
    padding: 24,
    marginTop: 48,
    justifyContent: "flex-start",
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 26,
  },
  logoCard: {
    width: 92,
    height: 92,
    borderRadius: 48,
    padding: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: Colors.point,
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  logoImage: {
    width: "110%",
    height: "110%",
    borderRadius: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.pointDark,
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: -0.5,
    shadowColor: Colors.point,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  subtitle: {
    fontSize: Platform.OS === "ios" ? 13 : 12.5,
    color: Colors.subText,
    textAlign: "center",
    marginTop: 2,
  },
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
    marginTop: 12,
  },

  submitButton: {
    backgroundColor: Colors.point,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
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
    fontSize: Platform.OS === "ios" ? 13 : 12.5,
    marginTop: 8,
    marginBottom: 4,
    color: Colors.subText,
  },
  linkHighlight: {
    color: Colors.point,
    fontWeight: "bold",
  },

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
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    alignItems: "flex-start",
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    color: "#868E96",
    lineHeight: 18,
  },
  guideCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  guideSection: {
    paddingVertical: 2,
  },
  guideTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  guideSectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#212529",
    marginLeft: 6,
  },
  guideText: {
    fontSize: 12,
    color: "#495057",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#E9ECEF",
    marginVertical: 12,
  },
});
