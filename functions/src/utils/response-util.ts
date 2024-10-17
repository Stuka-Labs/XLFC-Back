import {ErrorResponse, SuccessResponse} from "../models/custom-responses";

export const buildErrorResponse =
    (statusCode: number, message: string): ErrorResponse => {
      return {
        statusCode: statusCode,
        errorMessage: message,
      };
    };

export const buildSuccessResponse =
    (statusCode: number, message: string, data: unknown): SuccessResponse => {
      return {
        statusCode: statusCode,
        message: message,
        data: data,
      };
    };

