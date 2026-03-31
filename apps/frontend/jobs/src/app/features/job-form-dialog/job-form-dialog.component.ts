import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpContext, HttpErrorResponse } from '@angular/common/http';
import { CreateJobDto } from '../../models/job.model';
import { JobFormDialogData } from '../../models/job-form-dialog.model';
import { JOB_STATUS_OPTIONS } from '../../constants/job-status.constants';
import { HANDLE_ERROR_LOCALLY } from '../../constants/http-context.constants';
import { JobsService } from '../../services/jobs.service';
import { extractError } from '../../utils/extract-error.util';

@Component({
  selector: 'app-job-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './job-form-dialog.component.html',
  styleUrl: './job-form-dialog.component.scss',
})
export class JobFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<JobFormDialogComponent>);
  private readonly jobsService = inject(JobsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly localContext = new HttpContext().set(HANDLE_ERROR_LOCALLY, true);

  protected readonly data: JobFormDialogData = inject(MAT_DIALOG_DATA);
  protected readonly statusOptions = JOB_STATUS_OPTIONS;
  protected readonly isEdit = !!this.data?.job;
  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected form!: FormGroup;

  public ngOnInit(): void {
    const job = this.data?.job;
    this.form = this.fb.group({
      company: [job?.company ?? '', Validators.required],
      position: [job?.position ?? '', Validators.required],
      status: [job?.status ?? 'applied', Validators.required],
      appliedAt: [
        job?.appliedAt
          ? job.appliedAt.substring(0, 10)
          : new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
      link: [job?.link ?? ''],
      notes: [job?.notes ?? ''],
    });
  }

  protected submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.serverError.set(null);

    const value = this.form.getRawValue() as CreateJobDto;
    const request$ = this.isEdit
      ? this.jobsService.update(this.data.job!.id, value, this.localContext)
      : this.jobsService.create(value, this.localContext);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.serverError.set(extractError(err));
      },
    });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
