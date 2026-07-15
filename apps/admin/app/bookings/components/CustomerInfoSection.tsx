"use client";

import { Card, Input } from "antd";
import type { TFunction } from "i18next";

const NOTE_CHIPS_KEYS = [
  "hasChildren",
  "needsChildChair",
  "needsBirthdayDecor",
  "weddingAnniversary",
  "importantEvent",
] as const;

export interface CustomerInfoSectionProps {
  t: TFunction;
  readOnly?: boolean;
  name: string;
  onNameChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  phoneError?: boolean;
  email: string;
  onEmailChange: (value: string) => void;
  emailError?: boolean;
  note: string;
  onNoteChange: (value: string) => void;
}

export function CustomerInfoSection({
  t,
  readOnly,
  name,
  onNameChange,
  phone,
  onPhoneChange,
  phoneError,
  email,
  onEmailChange,
  emailError,
  note,
  onNoteChange,
}: CustomerInfoSectionProps) {
  const toggleChip = (label: string) => {
    const trimmed = note.trim();
    if (trimmed.split(", ").filter(Boolean).includes(label)) {
      const remaining = trimmed
        .split(", ")
        .filter((chunk) => chunk && chunk !== label)
        .join(", ");
      onNoteChange(remaining);
    } else {
      onNoteChange(trimmed ? `${trimmed}, ${label}` : label);
    }
  };

  const activeChips = new Set(note.split(", ").map((s) => s.trim()).filter(Boolean));

  return (
    <Card title={t("new.section.customerInfo")}>
      <div className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
              {t("new.field.fullName")}
            </label>
            <Input value={name} onChange={(e) => onNameChange(e.target.value)} disabled={readOnly} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
              {t("new.field.phone")}
            </label>
            <Input
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              disabled={readOnly}
              status={phoneError ? "error" : undefined}
            />
            {phoneError && (
              <p className="text-[11px] text-red-500 mt-1">{t("new.field.phoneInvalid")}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
            {t("new.field.email")}
          </label>
          <Input
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={readOnly}
            status={emailError ? "error" : undefined}
          />
          {emailError && (
            <p className="text-[11px] text-red-500 mt-1">{t("new.field.emailInvalid")}</p>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
            {t("new.field.note")}
          </label>
          <Input.TextArea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            disabled={readOnly}
            rows={3}
            className="mb-2"
          />
          <div className="flex flex-wrap gap-2 mt-3.5">
            {NOTE_CHIPS_KEYS.map((key) => {
              const label = t(`new.field.noteChips.${key}`);
              const isActive = activeChips.has(label);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleChip(label)}
                  disabled={readOnly}
                  className={`px-3 py-1 rounded-full border text-xs ${
                    isActive
                      ? "border-amber-400 bg-amber-50 text-admin-ink"
                      : "border-admin-border text-admin-ink-soft"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
