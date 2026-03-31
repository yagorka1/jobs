import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthUser } from '../models/auth-user.model';
import { environment } from '../../environments/environment';

const mockUser: AuthUser = { id: 'u1', email: 'test@test.com', name: 'Test User' };
const API = environment.apiUrl;

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('checkAuth()', () => {
    it('returns true and sets user signal on success', () => {
      let result: boolean | undefined;
      service.checkAuth().subscribe((v) => (result = v));

      http.expectOne(`${API}/auth/me`).flush(mockUser);

      expect(result).toBe(true);
      expect(service.user()).toEqual(mockUser);
    });

    it('returns false and clears user signal on 401', () => {
      service.user.set(mockUser);
      let result: boolean | undefined;
      service.checkAuth().subscribe((v) => (result = v));

      http.expectOne(`${API}/auth/me`).flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(result).toBe(false);
      expect(service.user()).toBeNull();
    });

    it('sends request with withCredentials', () => {
      service.checkAuth().subscribe();

      const req = http.expectOne(`${API}/auth/me`);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockUser);
    });
  });

  describe('logout()', () => {
    it('clears user signal after logout', () => {
      service.user.set(mockUser);
      service.logout().subscribe();

      http.expectOne(`${API}/auth/logout`).flush(null);

      expect(service.user()).toBeNull();
    });

    it('sends POST with withCredentials', () => {
      service.logout().subscribe();

      const req = http.expectOne(`${API}/auth/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      req.flush(null);
    });
  });
});
