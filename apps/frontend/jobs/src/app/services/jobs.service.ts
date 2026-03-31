import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, CreateJobDto, UpdateJobDto } from '../models/job.model';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);

  public getAll(): Observable<Job[]> {
    return this.http.get<Job[]>(`${API_URL}/jobs`, { withCredentials: true });
  }

  public create(dto: CreateJobDto, context?: HttpContext): Observable<Job> {
    return this.http.post<Job>(`${API_URL}/jobs`, dto, { withCredentials: true, context });
  }

  public update(id: string, dto: UpdateJobDto, context?: HttpContext): Observable<Job> {
    return this.http.patch<Job>(`${API_URL}/jobs/${id}`, dto, { withCredentials: true, context });
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/jobs/${id}`, { withCredentials: true });
  }
}
