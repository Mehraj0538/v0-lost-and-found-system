export class APIError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'APIError';
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_EXISTS: 'USER_EXISTS',
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  CLAIM_NOT_FOUND: 'CLAIM_NOT_FOUND',
  INQUIRY_NOT_FOUND: 'INQUIRY_NOT_FOUND',
};

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return {
      status: error.status,
      body: {
        code: error.code,
        message: error.message,
      },
    };
  }

  if (error instanceof Error) {
    console.error('[API Error]', error.message);
    return {
      status: 500,
      body: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'Internal server error',
      },
    };
  }

  console.error('[API Error]', error);
  return {
    status: 500,
    body: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'Internal server error',
    },
  };
}

export function createErrorResponse(error: unknown) {
  const { status, body } = handleAPIError(error);
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
