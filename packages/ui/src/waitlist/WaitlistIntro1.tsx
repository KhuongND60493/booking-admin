import { WaitlistIntroProps } from "../types";

// Biến thể 1: banner "Hết bàn trống" tĩnh.
export function WaitlistIntro1(_props: WaitlistIntroProps) {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 font-body">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-red-600 mb-1">Hết bàn trống</div>
        <div className="text-xs text-red-500">Đăng ký chờ và chúng tôi sẽ liên hệ khi có bàn.</div>
      </div>
    </div>
  );
}
