import { Component } from '@angular/core';
import { JobsTableComponent } from '../features/jobs-table/jobs-table.component';

@Component({
  imports: [JobsTableComponent],
  selector: 'app-jobs-entry',
  template: `<app-jobs-table></app-jobs-table>`,
})
export class RemoteEntry {}
