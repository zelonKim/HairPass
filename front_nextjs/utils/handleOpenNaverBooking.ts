export const handleOpenNaverBooking = () => {
  const naverBookingUrl =
    "https://m.place.naver.com/my/timeline?tab=RESERVATION";

  try {
    window.open(naverBookingUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("링크 열기 실패:", error);
  }
};
