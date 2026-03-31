import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { JobFormDialogComponent } from './job-form-dialog.component';
import { JobsService } from '../../services/jobs.service';
import { Job } from '../../models/job.model';

const mockJob: Job = {
  id: 'j1',
  company: 'Acme',
  position: 'Developer',
  status: 'applied',
  appliedAt: '2026-03-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  userId: 'u1',
};

function createComponent(dialogData: object, jobsServiceOverrides: object = {}) {
  const jobsService = {
    create: vi.fn().mockReturnValue(of(mockJob)),
    update: vi.fn().mockReturnValue(of(mockJob)),
    ...jobsServiceOverrides,
  };
  const dialogRef = { close: vi.fn() };

  TestBed.configureTestingModule({
    imports: [JobFormDialogComponent, NoopAnimationsModule],
    providers: [
      { provide: JobsService, useValue: jobsService },
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
    ],
  });

  const fixture = TestBed.createComponent(JobFormDialogComponent);
  fixture.detectChanges();
  return { fixture, component: fixture.componentInstance, jobsService, dialogRef };
}

describe('JobFormDialogComponent — Add mode', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('creates in add mode with empty form', () => {
    const { component } = createComponent({});
    expect(component['isEdit']).toBe(false);
    expect(component['form'].get('company')?.value).toBe('');
  });

  it('submit() calls jobsService.create and closes dialog with true', () => {
    const { component, jobsService, dialogRef } = createComponent({});
    component['form'].setValue({
      company: 'Acme',
      position: 'Developer',
      status: 'applied',
      appliedAt: '2026-01-01',
      link: '',
      notes: '',
    });

    component['submit']();

    expect(jobsService.create).toHaveBeenCalledOnce();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('submit() does nothing when form is invalid', () => {
    const { component, jobsService } = createComponent({});

    component['submit']();

    expect(jobsService.create).not.toHaveBeenCalled();
  });

  it('sets serverError signal on API error', () => {
    const error = new HttpErrorResponse({ error: { message: 'Server error' }, status: 500, statusText: 'Error' });
    const { component } = createComponent({}, { create: vi.fn().mockReturnValue(throwError(() => error)) });

    component['form'].setValue({
      company: 'Acme',
      position: 'Developer',
      status: 'applied',
      appliedAt: '2026-01-01',
      link: '',
      notes: '',
    });
    component['submit']();

    expect(component['serverError']()).toBe('Server error');
    expect(component['loading']()).toBe(false);
  });

  it('cancel() closes dialog without value', () => {
    const { component, dialogRef } = createComponent({});
    component['cancel']();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});

describe('JobFormDialogComponent — Edit mode', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('creates in edit mode with pre-filled form', () => {
    const { component } = createComponent({ job: mockJob });
    expect(component['isEdit']).toBe(true);
    expect(component['form'].get('company')?.value).toBe('Acme');
    expect(component['form'].get('position')?.value).toBe('Developer');
  });

  it('submit() calls jobsService.update with job id', () => {
    const { component, jobsService, dialogRef } = createComponent({ job: mockJob });

    component['submit']();

    expect(jobsService.update).toHaveBeenCalledWith('j1', expect.any(Object), expect.any(Object));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
