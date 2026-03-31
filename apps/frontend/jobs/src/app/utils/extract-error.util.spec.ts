import { HttpErrorResponse } from '@angular/common/http';
import { extractError } from './extract-error.util';

function makeError(body: unknown, status = 400, statusText = 'Bad Request'): HttpErrorResponse {
  return new HttpErrorResponse({ error: body, status, statusText });
}

describe('extractError', () => {
  it('returns string message from body.message string', () => {
    const err = makeError({ message: 'Company is required' });
    expect(extractError(err)).toBe('Company is required');
  });

  it('joins array messages', () => {
    const err = makeError({ message: ['field A is required', 'field B is required'] });
    expect(extractError(err)).toBe('field A is required, field B is required');
  });

  it('returns body directly when body is a string', () => {
    const err = makeError('Unauthorized');
    expect(extractError(err)).toBe('Unauthorized');
  });

  it('falls back to "Error <status>: <statusText>" for unknown body', () => {
    const err = makeError({ code: 42 }, 500, 'Internal Server Error');
    expect(extractError(err)).toBe('Error 500: Internal Server Error');
  });

  it('falls back when body is null', () => {
    const err = makeError(null, 503, 'Service Unavailable');
    expect(extractError(err)).toBe('Error 503: Service Unavailable');
  });
});
