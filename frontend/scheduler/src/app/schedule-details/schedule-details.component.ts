import { Component, OnInit } from '@angular/core';
import { Schedule } from './../../models/schedule.model';
import { ScheduleService } from './../services/schedule.service';

@Component({
  selector: 'app-schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.css']
})
export class ScheduleDetailsComponent implements OnInit {

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
  }

}
