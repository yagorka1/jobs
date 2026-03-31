import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { JobsTableComponent } from './jobs-table.component';
import { JobsService } from '../../services/jobs.service';
import { Job } from '../../models/job.model';

const mockJob: Job = {
  id: 'j1',
  company: 'Acme',
  position: 'Developer',
  status: 'applied',
  appliedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  userId: 'u1',
};

describe('JobsTableComponent (integration)', () => {
  let fixture: ComponentFixture<JobsTableComponent>;
  let component: JobsTableComponent;
  let jobsService: { getAll: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    jobsService = {
      getAll: vi.fn().mockReturnValue(of([mockJob])),
      remove: vi.fn().mockReturnValue(of(undefined)),
    };
    dialog = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [JobsTableComponent, NoopAnimationsModule],
      providers: [
        { provide: JobsService, useValue: jobsService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('loads jobs on init and renders rows', () => {
    expect(jobsService.getAll).toHaveBeenCalledOnce();
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(1);
  });

  it('renders job data in table cells', () => {
    const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
    const texts = Array.from(cells).map((c: Element) => c.textContent?.trim());
    expect(texts).toContain('Acme');
    expect(texts).toContain('Developer');
  });

  it('shows empty state when no jobs', () => {
    jobsService.getAll.mockReturnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.empty-state');
    expect(empty).toBeTruthy();
  });

  it('openAddDialog() opens dialog and reloads jobs on success', () => {
    const afterClosed$ = new Subject<boolean>();
    dialog.open.mockReturnValue({ afterClosed: () => afterClosed$.asObservable() } as MatDialogRef<unknown>);

    (component as unknown as { openAddDialog: () => void }).openAddDialog();
    afterClosed$.next(true);

    expect(dialog.open).toHaveBeenCalledOnce();
    expect(jobsService.getAll).toHaveBeenCalledTimes(2);
  });

  it('openAddDialog() does not reload jobs when dialog is cancelled', () => {
    const afterClosed$ = new Subject<boolean>();
    dialog.open.mockReturnValue({ afterClosed: () => afterClosed$.asObservable() } as MatDialogRef<unknown>);

    (component as unknown as { openAddDialog: () => void }).openAddDialog();
    afterClosed$.next(false);

    expect(jobsService.getAll).toHaveBeenCalledOnce();
  });

  it('openEditDialog() opens dialog with job data', () => {
    const afterClosed$ = new Subject<boolean>();
    dialog.open.mockReturnValue({ afterClosed: () => afterClosed$.asObservable() } as MatDialogRef<unknown>);

    (component as unknown as { openEditDialog: (job: Job) => void }).openEditDialog(mockJob);
    afterClosed$.complete();

    expect(dialog.open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ data: { job: mockJob } })
    );
  });

  it('deleteJob() calls remove and reloads on confirm', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    (component as unknown as { deleteJob: (job: Job) => void }).deleteJob(mockJob);

    expect(jobsService.remove).toHaveBeenCalledWith('j1');
    expect(jobsService.getAll).toHaveBeenCalledTimes(2);
  });

  it('deleteJob() does nothing when confirm is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    (component as unknown as { deleteJob: (job: Job) => void }).deleteJob(mockJob);

    expect(jobsService.remove).not.toHaveBeenCalled();
  });
});
