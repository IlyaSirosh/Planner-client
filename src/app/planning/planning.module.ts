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
import { ProjectPickerComponent } from './forms/project-picker/project-picker.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerComponent } from './forms/color-picker/color-picker.component';


const routes: Routes = [
  { path: 'planning',
    component: PlanningComponent,
    children: [
      { path: '', redirectTo: 'current/month', pathMatch: 'full'},
      { path: 'current/month', component: MonthComponent },
      { path: 'current/day', component: DayComponent},
      { path: ':year/:month/:day', component: DayComponent },
      { path: ':year/:month', component: MonthComponent }
    ]}
];

@NgModule({
  declarations: [PlanningComponent, DayComponent, MonthComponent, TaskListComponent, TaskComponent, DayTaskComponent, DayTimeRangeComponent, TasksConnectorDirective, DayPlanComponent, TaskScrollableDirective, RepetitionLabelComponent, ProjectComponent, FormsComponent, DeadlinePickerComponent, MonthViewComponent, CalendarComponent, ProjectPickerComponent, ColorPickerComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ColorPickerModule
  ]
})
export class PlanningModule { }
