import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpContext } from '@angular/common/http';
import { JobsService } from './jobs.service';
import { Job, CreateJobDto, UpdateJobDto } from '../models/job.model';
import { HANDLE_ERROR_LOCALLY } from '../constants/http-context.constants';
import { environment } from '../../environments/environment';

const mockJob: Job = {
  id: 'j1',
  company: 'Acme',
  position: 'Developer',
  status: 'applied',
  appliedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  userId: 'u1',
};

const API = environment.apiUrl;

describe('JobsService', () => {
  let service: JobsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(JobsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getAll()', () => {
    it('returns list of jobs', () => {
      let jobs: Job[] | undefined;
      service.getAll().subscribe((j) => (jobs = j));

      http.expectOne(`${API}/jobs`).flush([mockJob]);

      expect(jobs).toEqual([mockJob]);
    });

    it('sends GET with withCredentials', () => {
      service.getAll().subscribe();

      const req = http.expectOne(`${API}/jobs`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush([]);
    });
  });

  describe('create()', () => {
    const dto: CreateJobDto = {
      company: 'Acme',
      position: 'Developer',
      status: 'applied',
      appliedAt: '2026-01-01',
    };

    it('returns created job', () => {
      let result: Job | undefined;
      service.create(dto).subscribe((j) => (result = j));

      http.expectOne(`${API}/jobs`).flush(mockJob);

      expect(result).toEqual(mockJob);
    });

    it('sends POST with correct body and withCredentials', () => {
      service.create(dto).subscribe();

      const req = http.expectOne(`${API}/jobs`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockJob);
    });

    it('passes HttpContext when provided', () => {
      const context = new HttpContext().set(HANDLE_ERROR_LOCALLY, true);
      service.create(dto, context).subscribe();

      const req = http.expectOne(`${API}/jobs`);
      expect(req.request.context.get(HANDLE_ERROR_LOCALLY)).toBe(true);
      req.flush(mockJob);
    });
  });

  describe('update()', () => {
    const dto: UpdateJobDto = { position: 'Senior Developer' };

    it('returns updated job', () => {
      let result: Job | undefined;
      service.update('j1', dto).subscribe((j) => (result = j));

      http.expectOne(`${API}/jobs/j1`).flush({ ...mockJob, ...dto });

      expect(result?.position).toBe('Senior Developer');
    });

    it('sends PATCH to correct URL with body', () => {
      service.update('j1', dto).subscribe();

      const req = http.expectOne(`${API}/jobs/j1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      req.flush(mockJob);
    });
  });

  describe('remove()', () => {
    it('sends DELETE to correct URL', () => {
      service.remove('j1').subscribe();

      const req = http.expectOne(`${API}/jobs/j1`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBe(true);
      req.flush(null);
    });
  });
});
