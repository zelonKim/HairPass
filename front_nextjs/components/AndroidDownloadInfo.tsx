import Image from "next/image";

export const AndroidDownloadInfo = () => (
  <>
    <div className="w-52 h-52 bg-white rounded-2xl p-3 flex items-center justify-center shadow-inner border border-gray-100 mb-5 animate-fade-in relative">
      <Image
        src="/HairPass_install_Android_QR.png"
        alt="Android Build QR"
        width={208}
        height={208}
        className="w-full h-full object-contain"
      />
    </div>

    <div
      className={`w-full rounded-2xl p-4 text-[13px] font-medium space-y-2 border ${"bg-gray-50 border-gray-200"}`}
    >
      <div className="flex justify-between items-center">
        <span className={"text-gray-500"}>지원 환경:</span>
        <span className="text-emerald-500 font-bold">Android (APK)</span>
      </div>
      <div className="flex justify-between items-center">
        <span className={"text-gray-500"}>테스트 계정:</span>
        <span className="font-bold text-blue-500">test@zelon.com</span>
      </div>
      <div className="flex justify-between items-center">
        <span className={"text-gray-500"}>비밀번호:</span>
        <span className="font-bold text-blue-500">zelon1234</span>
      </div>
      <p
        className={`text-xs leading-relaxed pt-1.5 border-t border-dashed ${"border-gray-300 text-gray-400"}`}
      >
        * 다운로드 중 &apos;출처를 알 수 없는 앱&apos; 경고 발생 시, &apos;무시하고
        설치하기&apos; 버튼을 눌러주세요.
      </p>
    </div>
  </>
);
