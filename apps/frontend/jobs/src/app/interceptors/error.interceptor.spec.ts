import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpContext,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorInterceptor } from './error.interceptor';
import { HANDLE_ERROR_LOCALLY } from '../constants/http-context.constants';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let snackBar: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    snackBar = { open: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor as HttpInterceptorFn])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shows snack bar on HTTP error', () => {
    http.get('/api/jobs').subscribe({ error: () => { /* expected */ } });

    httpMock.expectOne('/api/jobs').flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });

    expect(snackBar.open).toHaveBeenCalledWith('Not found', 'Close', {
      duration: 4000,
      panelClass: 'snack-error',
    });
  });

  it('does not show snack bar when HANDLE_ERROR_LOCALLY is set', () => {
    const context = new HttpContext().set(HANDLE_ERROR_LOCALLY, true);
    http.get('/api/jobs', { context }).subscribe({ error: () => { /* expected */ } });

    httpMock.expectOne('/api/jobs').flush({ message: 'Conflict' }, { status: 409, statusText: 'Conflict' });

    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('passes through successful responses without showing snack bar', () => {
    http.get('/api/jobs').subscribe();

    httpMock.expectOne('/api/jobs').flush([]);

    expect(snackBar.open).not.toHaveBeenCalled();
  });
});
