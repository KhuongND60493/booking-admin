import { Suspense } from "react";
import DevPreviewClient from "./DevPreviewClient";
import { DEV_PREVIEW_MODULE_KEYS } from "./moduleKeys";

/**
 * Harness dev-only để phát triển/test containers/* (lớp expose qua Module Federation)
 * bằng `next dev` bình thường — KHÔNG cần FEDERATION_DEV=true, giữ nguyên Fast Refresh.
 * Giả lập đúng props mà host (skyresto-webman) truyền vào lúc chạy thật qua remote-module-router.tsx.
 *
 * Dùng: /dev-preview/<module-key>?tenantId=...&locale=vi&parentPage=1&permissions=a,b,c
 * Không đưa vào exposes của ModuleFederationPlugin, không deploy ra registry — chỉ chạy khi `next dev` local.
 */
export function generateStaticParams() {
  return DEV_PREVIEW_MODULE_KEYS.map((module) => ({ module }));
}

export default async function DevPreviewPage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  return (
    <Suspense fallback={null}>
      <DevPreviewClient module={module} />
    </Suspense>
  );
}
