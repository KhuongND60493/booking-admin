export const PERMISSIONS = {
  BOOKING: {
    VIEW: "bo-view-booking",
    CREATE: "bo-create-booking",
    EDIT: "bo-edit-booking",
    CANCEL: "bo-cancel-booking",
  },
} as const;

type PermissionGroup = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type PermissionKey = PermissionGroup[keyof PermissionGroup];
