"use client";
import { useRouter } from "next/navigation";
import { useBookingContext } from "@skybooking/hooks";

// Trạng thái sau khi đăng ký waitlist thành công.
export function WaitlistDone1() {
  const { tenant } = useBookingContext();
  const router = useRouter();
  return (
    <div className="max-w-lg mx-auto py-12 px-4 flex flex-col items-center text-center font-body">
      <div className="w-15 h-15 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <span className="text-primary text-xl">⏱</span>
      </div>
      <h2 className="text-lg font-heading font-medium text-ink mb-2">Đã đăng ký chờ!</h2>
      <p className="text-xs text-ink-muted mb-5">
        Chúng tôi sẽ liên hệ bạn qua số điện thoại khi có bàn trống phù hợp.
      </p>
      <button
        onClick={() => router.push(`/${tenant}`)}
        className="px-7 py-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary text-sm font-medium"
      >
        Về trang chủ
      </button>
    </div>
  );
}
