import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Job } from '../../models/job.model';
import { JobFormDialogData } from '../../models/job-form-dialog.model';
import { JobsService } from '../../services/jobs.service';
import { JobFormDialogComponent } from '../job-form-dialog/job-form-dialog.component';

@Component({
  selector: 'app-jobs-table',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    DatePipe,
  ],
  templateUrl: './jobs-table.component.html',
  styleUrl: './jobs-table.component.scss',
})
export class JobsTableComponent implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly jobs = signal<Job[]>([]);
  protected readonly displayedColumns = ['company', 'position', 'status', 'appliedAt', 'link', 'actions'];

  public ngOnInit(): void {
    this.loadJobs();
  }

  protected openAddDialog(): void {
    this.dialog
      .open<JobFormDialogComponent, JobFormDialogData, true>(JobFormDialogComponent, { data: {} })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success) => {
        if (success) this.loadJobs();
      });
  }

  protected openEditDialog(job: Job): void {
    this.dialog
      .open<JobFormDialogComponent, JobFormDialogData, true>(JobFormDialogComponent, { data: { job } })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success) => {
        if (success) this.loadJobs();
      });
  }

  protected deleteJob(job: Job): void {
    if (!confirm(`Delete "${job.position}" at ${job.company}?`)) return;
    this.jobsService
      .remove(job.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.loadJobs() });
  }

  private loadJobs(): void {
    this.jobsService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (jobs) => this.jobs.set(jobs) });
  }
}
