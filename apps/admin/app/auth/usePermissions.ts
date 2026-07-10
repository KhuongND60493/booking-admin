"use client";

import { useCallback } from "react";
import type { PermissionKey } from "./permissions";

const grantedKeys: ReadonlySet<PermissionKey> | null = null;

export function usePermissions() {
  const hasPermission = useCallback((key: PermissionKey): boolean => {
    if (grantedKeys === null) return true;
    return grantedKeys.has(key);
  }, []);

  return { hasPermission };
}
