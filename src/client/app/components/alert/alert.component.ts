import { Component, OnInit } from '@angular/core';

import { AlertService } from './alert.service';

@Component({
  moduleId: module.id,
  selector: 'alert',
  templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit {
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => { this.message = message; });
  }
}
