import { HttpErrorResponse } from '@angular/common/http';

export function extractError(err: HttpErrorResponse): string {
  const body = err.error;
  if (typeof body?.message === 'string') return body.message;
  if (Array.isArray(body?.message)) return body.message.join(', ');
  if (typeof body === 'string') return body;
  return `Error ${err.status}: ${err.statusText}`;
}
