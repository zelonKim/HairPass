import Colors from "@/constants/Colors";
import { useSignupMutation } from "@/hooks/auth/useSignupMutation";
import { useRouter } from "expo-router";
import { Lock, UserRound } from "lucide-react-native";
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

export default function SignupScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  /////////////////////////////////////////////////////////////////////

  const { mutate: signupMutation, isPending: signupPending } =
    useSignupMutation();

  const handleSignup = () => {
    if (!username.trim()) {
      Alert.alert("알림", "아이디를 입력해 주세요.");
      return;
    }
    if (!password) {
      Alert.alert("알림", "비밀번호를 입력해 주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert("알림", "비밀번호가 서로 일치하지 않습니다.");
      return;
    }
    signupMutation({
      username: username.trim(),
      password,
      password_confirm: passwordConfirm,
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
            <Text style={styles.title}>환영합니다💈</Text>
            <Text style={styles.subtitle}>
              앞으로 미용실 예약은 헤어패스에 맡겨요.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionHeaderTitle}>가입 정보 입력</Text>

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

            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.inputContainer}>
              <Lock size={18} color={Colors.subText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="영문 + 숫자 8자 이상"
                placeholderTextColor={Colors.muted}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>

            <Text style={styles.label}>비밀번호 확인</Text>
            <View style={styles.inputContainer}>
              <Lock size={18} color={Colors.subText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                placeholder="비밀번호를 다시 입력해주세요."
                placeholderTextColor={Colors.muted}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignup}
              disabled={signupPending}
              activeOpacity={0.8}
            >
              {signupPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>시작하기</Text>
              )}
            </TouchableOpacity>

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

/////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
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
    elevation: 1,
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
    fontSize: Platform.OS === "ios" ? 14 : 13.5,
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
    marginTop: 24,
    alignItems: "center",
    marginBottom: 3,
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
