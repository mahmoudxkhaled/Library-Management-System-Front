import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbacksRoutingModule } from './feedbacks-routing.module';
import { FeedbackListComponent } from './components/feedback-list/feedback-list.component';
import { SharedModule } from 'primeng/api';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';


@NgModule({
  declarations: [FeedbackListComponent],
  imports: [
    LMSSharedModule,
    FeedbacksRoutingModule
  ]
})
export class FeedbacksModule { }
