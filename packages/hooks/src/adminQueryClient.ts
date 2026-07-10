import { QueryCache, QueryClient, MutationCache } from "@tanstack/react-query";
import { message } from "antd";
import { ApiError, BOOKING_ERROR_DEFAULT_MESSAGE_VI } from "@skybooking/api-client";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      disableErrorToast?: boolean;
    };
    mutationMeta: {
      successMessage?: string;
      errorMessage?: string;
      disableErrorToast?: boolean;
    };
  }
}

function resolveErrorMessage(error: unknown, fallback?: string): string {
  if (fallback) return fallback;
  if (error instanceof ApiError) {
    if (error.errorNumber != null && BOOKING_ERROR_DEFAULT_MESSAGE_VI[error.errorNumber]) {
      return BOOKING_ERROR_DEFAULT_MESSAGE_VI[error.errorNumber];
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Có lỗi xảy ra, vui lòng thử lại";
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
        message.error(resolveErrorMessage(error));
      },
    }),
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.successMessage) message.success(mutation.meta.successMessage);
      },
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.disableErrorToast) return;
        message.error(resolveErrorMessage(error, mutation.meta?.errorMessage));
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
