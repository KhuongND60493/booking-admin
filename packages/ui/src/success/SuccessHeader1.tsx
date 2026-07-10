import { SuccessHeaderProps } from "../types";

// Biến thể 1: icon check + tiêu đề thành công.
export function SuccessHeader1({ heading }: SuccessHeaderProps) {
  return (
    <div className="max-w-lg mx-auto px-4 pt-10 flex flex-col items-center font-body">
      <div className="w-16 h-16 rounded-2xl bg-green-100 border-2 border-green-300 flex items-center justify-center mb-4">
        <span className="text-green-600 text-2xl">✓</span>
      </div>
      <h2 className="text-xl font-heading font-medium text-ink mb-1 text-center">{heading}</h2>
      <p className="text-xs text-ink-muted text-center">Chúng tôi sẽ giữ bàn cho bạn</p>
    </div>
  );
}
