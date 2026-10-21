import { client } from "@/api/client";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 네이버 계정 데이터 타입 정의
interface NaverAccountData {
  naver_id: string;
  naver_pw: string;
}

export default function NaverAccountScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [naverId, setNaverId] = useState("");
  const [naverPw, setNaverPw] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // 1. useQuery를 이용한 네이버 계정 정보 조회
  const { data: accountData, isLoading: isFetching } =
    useQuery<NaverAccountData>({
      queryKey: ["naverAccount"],
      queryFn: async () => {
        const response = await client.get("/api/users/naver-account/");
        return response.data;
      },
    });

  // 서버에서 불러온 데이터를 input 상태에 동기화
  useEffect(() => {
    if (accountData) {
      if (accountData.naver_id) setNaverId(accountData.naver_id);
      if (accountData.naver_pw) setNaverPw(accountData.naver_pw);
    }
  }, [accountData]);

  // 2. useMutation을 이용한 네이버 계정 정보 수정/저장
  const mutation = useMutation({
    mutationFn: async (payload: NaverAccountData) => {
      const response = await client.patch("/api/users/naver-account/", payload);
      return response.data;
    },
    onSuccess: () => {
      // 관련 쿼리 무효화 및 갱신
      queryClient.invalidateQueries({ queryKey: ["naverAccount"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });

      Alert.alert("성공", "네이버 계정 정보가 연동되었습니다!", [
        {
          text: "확인",
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          },
        },
      ]);
    },
    onError: (error) => {
      console.error("네이버 계정 저장 실패:", error);
      Alert.alert("오류", "계정 정보 저장 중 문제가 발생했습니다.");
    },
  });

  const handleSaveAccount = () => {
    mutation.mutate({
      naver_id: naverId.trim(),
      naver_pw: naverPw.trim(),
    });
  };

  const isLoading = mutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* 💡 화면 좌측 상단에 위치하는 뒤로가기 버튼 */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#35455b" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>네이버 계정 연동</Text>
          <Text style={styles.subtitle}>
            자동 예약 실행 시 사용할 네이버 계정 정보를 입력해 주세요.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>계정 아이디</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력해주세요."
              placeholderTextColor={Colors.muted}
              value={naverId}
              onChangeText={setNaverId}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isFetching}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>계정 비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호를 입력해주세요."
                value={naverPw}
                onChangeText={setNaverPw}
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor={Colors.muted}
                autoCapitalize="none"
                editable={!isFetching}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (isLoading || isFetching) && styles.disabledButton,
            ]}
            onPress={handleSaveAccount}
            disabled={isLoading || isFetching}
          >
            <Text style={styles.submitButtonText}>
              {isLoading
                ? "저장 중..."
                : isFetching
                  ? "불러오는 중..."
                  : "계정 연동하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 15,
  },
  eyeIconContainer: {
    paddingHorizontal: 14,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    height: 50,
    backgroundColor: "#03C75A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: "#a0e8bb",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  topBar: {
    width: "100%",
    alignItems: "flex-start",
    position: "absolute",
    top: 12,
    left: 20,
    marginBottom: 4, // 타이틀과의 간격 조절
  },
  backButton: {
    padding: 4, // 터치 영역은 넓히면서 좌측에 밀착
    justifyContent: "center",
    alignItems: "center",
  },
});
