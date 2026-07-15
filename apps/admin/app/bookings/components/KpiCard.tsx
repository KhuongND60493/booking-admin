export type KpiTone = "default" | "success" | "danger" | "warning";

const TONE_VALUE_CLASS: Record<KpiTone, string> = {
  default: "text-admin-ink",
  success: "text-admin-success",
  danger: "text-admin-danger",
  warning: "text-admin-warning",
};

export interface KpiCardProps {
  label: string;
  value: number | string;
  tone?: KpiTone;
}

export function KpiCard({ label, value, tone = "default" }: KpiCardProps) {
  return (
    <div className="bg-admin-surface rounded-lg p-4 border border-admin-border">
      <div className="text-[10px] font-semibold text-admin-muted uppercase mb-2">
        {label}
      </div>
      <div className={`text-2xl font-bold ${TONE_VALUE_CLASS[tone]}`}>
        {value}
      </div>
    </div>
  );
}
