export class ApiError extends Error {
  status?: number;
  errorCode?: string;
  errorNumber?: number;

  constructor(
    message: string,
    options?: { status?: number; errorCode?: string; errorNumber?: number }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.errorCode = options?.errorCode;
    this.errorNumber = options?.errorNumber;
  }
}
