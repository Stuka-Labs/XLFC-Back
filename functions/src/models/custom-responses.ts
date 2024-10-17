export interface ErrorResponse {
  statusCode: number;
  errorMessage: string;
}

export interface SuccessResponse {
  statusCode: number;
  message: string;
  data: unknown | undefined;
}
