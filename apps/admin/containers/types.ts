
export interface PropsRemotePageDefault {
    tenantId: string
    locale?: string
    parentPage?: number
    /**
     * Permission/role của user hiện tại, truyền từ host sau khi host đã kiểm tra
     * quyền truy cập module (xem skyresto-webman/src/lib/auth/permissions.ts).
     * Dùng để ẩn/disable action nhạy cảm bên trong module (vd: edit layout).
     */
    permissions?: string[]
}
