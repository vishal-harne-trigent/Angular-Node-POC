import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorBody } from '../models/user.model';

export function formatApiError(error: unknown, fallback = 'Something went wrong'): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = error.error as ApiErrorBody | string | null;

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (body && typeof body === 'object' && body.message) {
    const fieldMessages = body.errors
      ? Object.entries(body.errors)
          .flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))
          .join('; ')
      : '';

    return fieldMessages ? `${body.message} — ${fieldMessages}` : body.message;
  }

  return fallback;
}
