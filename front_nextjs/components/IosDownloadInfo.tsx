import Image from "next/image";

export const IosDownloadInfo = () => (
  <>
    <div className="w-52 h-52 bg-white rounded-2xl p-3 flex items-center justify-center shadow-inner border border-gray-100 mb-5 animate-fade-in relative">
      <Image
        src="/HairPass_install_iOS_QR.png"
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
        <span className="text-emerald-500 font-bold">iOS (TestFlight)</span>
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
        * 테스트 참여를 위해서는 TestFlight 앱이 먼저 설치되어 있어야 합니다.
      </p>
    </div>
  </>
);
