import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbacksRoutingModule } from './feedbacks-routing.module';
import { FeedbackListComponent } from './components/feedback-list/feedback-list.component';
import { SharedModule } from 'primeng/api';


@NgModule({
  declarations: [FeedbackListComponent],
  imports: [
    SharedModule,
    FeedbacksRoutingModule
  ]
})
export class FeedbacksModule { }
