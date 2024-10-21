export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface SuccessResponse {
  statusCode: number;
  message: string;
  data: unknown | undefined;
}
