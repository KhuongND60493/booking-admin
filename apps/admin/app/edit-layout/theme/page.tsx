"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeThemeApi, storeThemeKeys, type StoreTheme } from "@skybooking/api-client";

const DEMO_STORE_ID = "cuu-van-long-q1";

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

export default function EditLayoutThemePage() {
  const queryClient = useQueryClient();
  const { data: fetchedTheme } = useQuery({
    queryKey: storeThemeKeys.detail(DEMO_STORE_ID),
    queryFn: () => storeThemeApi.fetchTheme(DEMO_STORE_ID),
  });
  const [theme, setTheme] = useState<StoreTheme | null>(null);

  useEffect(() => {
    if (fetchedTheme) setTheme(fetchedTheme);
  }, [fetchedTheme]);

  const saveMutation = useMutation({
    mutationFn: (payload: StoreTheme) => storeThemeApi.saveTheme(DEMO_STORE_ID, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeThemeKeys.detail(DEMO_STORE_ID) });
    },
    meta: {
      successMessageKey: "toast.success.saveTheme",
      errorMessageKey: "toast.error.saveTheme",
    },
  });

  if (!theme) return <div className="p-8 text-sm text-gray-500">Đang tải theme...</div>;

  const setColor = (key: keyof StoreTheme["colors"], value: string) => {
    setTheme({ ...theme, colors: { ...theme.colors, [key]: value } });
  };
  const setFont = (key: keyof StoreTheme["fonts"], value: string) => {
    setTheme({ ...theme, fonts: { ...theme.fonts, [key]: value } });
  };

  const colorFields: { key: keyof StoreTheme["colors"]; label: string }[] = [
    { key: "primary", label: "Primary" },
    { key: "background", label: "Background" },
    { key: "text", label: "Text" },
    { key: "textMuted", label: "Text phụ (muted)" },
  ];

  const isValid = colorFields.every((f) => HEX_RE.test(theme.colors[f.key]));

  const handleSave = () => {
    if (!isValid) return;
    saveMutation.mutate({
      ...theme,
      storeId: DEMO_STORE_ID,
      fonts: { heading: theme.fonts.heading.trim(), body: theme.fonts.body.trim() },
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="text-xs mb-4">
        <Link href="/edit-layout" className="text-gray-500 hover:text-amber-600">
          Chỉnh sửa layout trang booking
        </Link>
        <span className="mx-1.5 text-gray-300">/</span>
        <span className="font-semibold text-gray-900">Theme</span>
      </div>
      <h1 className="font-heading text-xl font-bold text-gray-900 mb-1">Cấu hình Theme</h1>
      <p className="text-xs text-gray-500 mb-6">Màu sắc và font áp dụng cho toàn bộ trang booking của store</p>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Màu sắc</div>
        <div className="grid grid-cols-2 gap-4">
          {colorFields.map((f) => (
            <div key={f.key}>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1.5">{f.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.colors[f.key]}
                  onChange={(e) => setColor(f.key, e.target.value)}
                  className="w-9 h-9 rounded border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.colors[f.key]}
                  onChange={(e) => setColor(f.key, e.target.value)}
                  placeholder="#RRGGBB"
                  className={`flex-1 px-2.5 py-2 border rounded-md text-xs font-mono ${
                    HEX_RE.test(theme.colors[f.key]) ? "border-gray-200" : "border-red-400"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Font family</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1.5">Heading</label>
            <input
              type="text"
              value={theme.fonts.heading}
              onChange={(e) => setFont("heading", e.target.value)}
              placeholder="vd: Playfair Display"
              className="w-full px-2.5 py-2 border border-gray-200 rounded-md text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1.5">Body</label>
            <input
              type="text"
              value={theme.fonts.body}
              onChange={(e) => setFont("body", e.target.value)}
              placeholder="vd: Public Sans"
              className="w-full px-2.5 py-2 border border-gray-200 rounded-md text-xs"
            />
          </div>
        </div>
      </div>

      {!isValid && (
        <p className="text-xs text-red-600 mb-4">Màu phải đúng định dạng hex (#RRGGBB).</p>
      )}

      <button
        onClick={handleSave}
        disabled={!isValid || saveMutation.isPending}
        className="px-7 py-2.5 bg-amber-400 text-gray-900 rounded-lg text-xs font-semibold disabled:opacity-40"
      >
        Lưu theme
      </button>
    </div>
  );
}
