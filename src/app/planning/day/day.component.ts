import {AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {Task} from '../domain/task';
import {DayTimeRangeComponent} from './day-time-range/day-time-range.component';
import {DayTaskComponent} from '../day-task/day-task.component';
import {PlanningDay} from '../domain/planning-day';
import {Router} from '@angular/router';


@Component({
  selector: 'planning-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, AfterViewInit {

  day: PlanningDay;

  constructor(private renderer: Renderer2, private elem: ElementRef, private router: Router) { }

  ngOnInit() {
    this.day = new PlanningDay();

    this.day.tasks = Task.TASKS;
    this.day.date = new Date(Date.now());


  }

  ngAfterViewInit() {

  }

  goMonthView(month): void {
    this.router.navigate(['/planning/month']);
  }
}
