import { getFavorites } from "@/api/favorite/getFavorites";
import Colors from "@/constants/Colors";
import { useUpdateFavorites } from "@/hooks/favorite/useUpdateFavorites";
import { FavoriteData } from "@/types/favorite/FavoriteData";
import { useQuery } from "@tanstack/react-query";
import { Heart, Scissors, Store, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function FavoritesScreen() {
  const [favoriteSalon, setFavoriteSalon] = useState("");
  const [favoriteDesigner, setFavoriteDesigner] = useState("");
  const [favoriteMenu, setFavoriteMenu] = useState("");

  /////////////////////////////////////////////////////////////////////

  const { data, isPending, isError, refetch } = useQuery<FavoriteData>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  useEffect(() => {
    if (data) {
      setFavoriteSalon(data.favorite_salon || "");
      setFavoriteDesigner(data.favorite_designer || "");
      setFavoriteMenu(data.favorite_menu || "");
    }
  }, [data]);

  /////////////////////////////////////////////////////////////////////

  const { mutate: favUpdateMutation, isPending: favUpdatePending } =
    useUpdateFavorites();

  const handleSave = () => {
    favUpdateMutation({
      favorite_salon: favoriteSalon.trim(),
      favorite_designer: favoriteDesigner.trim(),
      favorite_menu: favoriteMenu.trim(),
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
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Heart
                size={24}
                color={Colors.primary}
                style={styles.titleIcon}
              />
              <Text style={styles.headerTitle}>나의 즐겨찾기</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              즐겨찾기를 설정하면 기본 예약 정보로 등록돼요.
            </Text>
          </View>

          {isPending ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>선호 정보를 불러오는 중...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>정보를 불러오지 못했습니다.</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formCard}>
              <Text style={styles.label}>단골 미용실</Text>
              <View style={styles.inputContainer}>
                <Store
                  size={18}
                  color={Colors.subText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={favoriteSalon}
                  onChangeText={setFavoriteSalon}
                  placeholder="미용실 이름을 입력해주세요"
                  placeholderTextColor={Colors.muted}
                />
              </View>

              <Text style={styles.label}>선호 디자이너</Text>
              <View style={styles.inputContainer}>
                <User
                  size={18}
                  color={Colors.subText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={favoriteDesigner}
                  onChangeText={setFavoriteDesigner}
                  placeholder="디자이너 이름을 입력해주세요."
                  placeholderTextColor={Colors.muted}
                />
              </View>

              {/* 3. 자주 받는 시술 메뉴 */}
              <Text style={styles.label}>자주 받는 시술 메뉴</Text>
              <View style={styles.inputContainer}>
                <Scissors
                  size={18}
                  color={Colors.subText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={favoriteMenu}
                  onChangeText={setFavoriteMenu}
                  placeholder="시술 메뉴 이름을 입력해주세요."
                  placeholderTextColor={Colors.muted}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={favUpdatePending}
                activeOpacity={0.8}
              >
                {favUpdatePending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>즐겨찾기 저장하기</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  titleIcon: {
    marginRight: 6,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: Platform.OS === "ios" ? 14 : 13,
    color: Colors.subText,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.subText,
    marginTop: 12,
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
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.subText,
  },
  errorText: {
    fontSize: 14,
    color: Colors.subText,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
});
