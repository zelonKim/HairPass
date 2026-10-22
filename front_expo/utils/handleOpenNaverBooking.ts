import { Linking } from "react-native";

export const handleOpenNaverBooking = async () => {
  const naverBookingUrl =
    "https://m.place.naver.com/my/timeline?tab=RESERVATION";

  try {
    const supported = await Linking.canOpenURL(naverBookingUrl);
    if (supported) {
      await Linking.openURL(naverBookingUrl);
    } else {
      console.error("열 수 없는 URL입니다:", naverBookingUrl);
    }
  } catch (error) {
    console.error("링크 열기 실패:", error);
  }
};
