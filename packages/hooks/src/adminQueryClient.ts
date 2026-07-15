import { QueryCache, QueryClient, MutationCache } from "@tanstack/react-query";
import type { MessageInstance } from "antd/es/message/interface";
import type { TFunction } from "i18next";
import { ApiError, BOOKING_ERROR_I18N_KEY } from "@skybooking/api-client";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      errorMessageKey?: string;
      errorMessageOptions?: Record<string, unknown>;
      disableErrorToast?: boolean;
    };
    mutationMeta: {
      successMessageKey?: string;
      successMessageOptions?: Record<string, unknown>;
      disableSuccessToast?: boolean;
      errorMessageKey?: string;
      errorMessageOptions?: Record<string, unknown>;
      disableErrorToast?: boolean;
    };
  }
}

let activeT: TFunction | undefined;
let activeMessage: MessageInstance | undefined;

export function setAdminQueryClientTranslator(t: TFunction) {
  activeT = t;
}

export function setAdminQueryClientMessage(messageApi: MessageInstance) {
  activeMessage = messageApi;
}

function resolveErrorMessage(
  error: unknown,
  fallbackKey?: string,
  fallbackOptions?: Record<string, unknown>
): string {
  const t = activeT;
  if (fallbackKey && t) return t(fallbackKey, fallbackOptions);
  if (error instanceof ApiError) {
    if (error.errorNumber != null && BOOKING_ERROR_I18N_KEY[error.errorNumber] && t) {
      return t(BOOKING_ERROR_I18N_KEY[error.errorNumber], { ns: "bookings" });
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return t ? t("toast.error.default") : "Có lỗi xảy ra, vui lòng thử lại";
}

function makeAdminQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => error instanceof ApiError && !error.status && failureCount < 2,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.disableErrorToast) return;
        activeMessage?.error(
          resolveErrorMessage(error, query.meta?.errorMessageKey, query.meta?.errorMessageOptions)
        );
      },
    }),
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.disableSuccessToast || !activeT) return;
        const key = mutation.meta?.successMessageKey ?? "toast.success.default";
        activeMessage?.success(activeT(key, mutation.meta?.successMessageOptions));
      },
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.disableErrorToast) return;
        activeMessage?.error(
          resolveErrorMessage(error, mutation.meta?.errorMessageKey, mutation.meta?.errorMessageOptions)
        );
      },
    }),
  });
}

let browserAdminQueryClient: QueryClient | undefined;

export function getAdminQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeAdminQueryClient();
  }
  if (!browserAdminQueryClient) browserAdminQueryClient = makeAdminQueryClient();
  return browserAdminQueryClient;
}
