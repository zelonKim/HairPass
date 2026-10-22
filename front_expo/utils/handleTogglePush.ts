import { deleteTokenFromServer } from "@/api/common/deleteTokenFromServer";
import { saveTokenToServer } from "@/api/common/saveTokenToServer";
import * as Notifications from "expo-notifications";
import { Alert, Linking } from "react-native";
import { registerForPushNotificationsAsync } from "./registerForPushNotificationsAsync";

export const handleTogglePush = async (
  value: boolean,
  setIsPushEnabled: (state: boolean) => void,
) => {
  setIsPushEnabled(value);

  if (value) {
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "알림 권한 필요",
        "메시지 알림을 받으려면 기기 설정에서 알림 권한을 허용해 주세요.",
        [
          { text: "취소", style: "cancel" },
          { text: "설정으로 이동", onPress: () => Linking.openSettings() },
        ],
      );
      setIsPushEnabled(false);
      return;
    }

    const token = await registerForPushNotificationsAsync();
    if (token) await saveTokenToServer(token);
  } else {
    await deleteTokenFromServer();
  }
};
