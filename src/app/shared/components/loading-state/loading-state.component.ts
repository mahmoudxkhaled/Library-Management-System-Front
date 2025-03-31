import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-state',
    template: `
    <div class="loading-state" *ngIf="show">
      <p-progressSpinner></p-progressSpinner>
      <p>{{message}}</p>
    </div>
  `,
    styles: [`
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin: 24px 0;
    }

    p {
      margin-top: 16px;
      color: #666;
    }
  `]
})
export class LoadingStateComponent {
    @Input() show: boolean = true;
    @Input() message: string = 'Loading...';
} 