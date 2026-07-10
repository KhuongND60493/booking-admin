"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { ConfigProvider, App } from "antd";

const AMBER = "#F59E0B";
const BORDER = "#E5E7EB";
const INK = "#111827";
const MUTED = "#6B7280";

export function AntdProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState<Entity>(() => createCache());

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: AMBER,
            colorBorder: BORDER,
            colorBorderSecondary: BORDER,
            colorText: INK,
            colorTextSecondary: MUTED,
            colorTextTertiary: MUTED,
            borderRadius: 8,
            controlHeight: 32,
            fontFamily: "var(--font-public-sans), sans-serif",
            fontSize: 14,
            boxShadow: "none",
            boxShadowSecondary: "0 4px 16px rgba(17, 24, 39, 0.08)",
          },
          components: {
            Button: {
              primaryColor: "#1F2937",
              defaultBorderColor: BORDER,
              defaultColor: INK,
              controlHeight: 32,
              fontWeight: 500,
              boxShadow: "none",
              boxShadowSecondary: "none",
            },
            Select: {
              controlHeight: 32,
            },
            Input: {
              controlHeight: 32,
            },
            DatePicker: {
              controlHeight: 32,
            },
            Popover: {
              boxShadowSecondary: "0 4px 16px rgba(17, 24, 39, 0.08)",
            },
            Table: {
              headerBg: "#F9FAFB",
              borderColor: BORDER,
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
}
