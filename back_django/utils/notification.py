import requests

def send_expo_push_notification(push_token, title, body, data=None):
    if not push_token or not push_token.startswith("ExponentPushToken["):
        print(f"⚠️ 유효하지 않거나 없는 푸시 토큰입니다: {push_token}")
        return

    url = "https://exp.host/--/api/v2/push/send"
    payload = {
        "to": push_token,
        "sound": "default",
        "title": title,
        "body": body,
        "data": data or {},
        "channelId": "default",
        "priority": "high",
    }
    headers = {
        "Accept": "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        response.raise_for_status()
        print("✨ 푸시 알림 전송 성공:", response.json())
    except Exception as e:
        print("❌ 푸시 알림 전송 실패:", e)
