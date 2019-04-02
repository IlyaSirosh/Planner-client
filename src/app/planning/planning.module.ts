import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning.component';
import { DayComponent } from './day/day.component';
import { MonthComponent } from './month/month.component';
import {RouterModule, Routes} from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import {SharedModule} from '../shared/shared.module';
import { TaskComponent } from './task-list/task/task.component';
import { DayTaskComponent } from './day-task/day-task.component';
import { DayTimeRangeComponent } from './day/day-time-range/day-time-range.component';
import { TasksConnectorDirective } from './day/tasks-connector.directive';
import { DayPlanComponent } from './day/day-plan/day-plan.component';
import { TaskScrollableDirective } from './day/task-scrollable.directive';
import { RepetitionLabelComponent } from './day-task/repetition-label/repetition-label.component';
import { ProjectComponent } from './task-list/project/project.component';
import { FormsComponent } from './forms/forms.component';
import { DeadlinePickerComponent } from './forms/deadline-picker/deadline-picker.component';
import { MonthViewComponent } from './month/month-view/month-view.component';
import { CalendarComponent } from './day/calendar/calendar.component';



const routes: Routes = [
  { path: '', component: PlanningComponent,
    children: [
      { path: '', redirectTo: 'day', pathMatch: 'full'},
      { path: 'day', component: DayComponent },
      { path: 'month', component: MonthComponent }
    ]}
];

@NgModule({
  declarations: [PlanningComponent, DayComponent, MonthComponent, TaskListComponent, TaskComponent, DayTaskComponent, DayTimeRangeComponent, TasksConnectorDirective, DayPlanComponent, TaskScrollableDirective, RepetitionLabelComponent, ProjectComponent, FormsComponent, DeadlinePickerComponent, MonthViewComponent, CalendarComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PlanningModule { }
