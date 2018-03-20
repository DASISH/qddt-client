import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { ControlConstructService, StatementConstruct } from '../controlconstruct.service';

@Component({
  selector: 'qddt-sequence-edit',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.edit.component.html',
  styles: [ ]
})
export class SequenceEditComponent implements OnInit {
  @Input() sequence: any;
  @Output() element: any = new EventEmitter<any>();
  statement: any;
  elementId: string;

  constructor(private service: ControlConstructService) {
  }

  ngOnInit() {
    this.statement = new StatementConstruct();
    this.elementId = new Date().toString();
  }

  onSaveSequence() {
    this.service.update(this.sequence)
    .subscribe(
      result => { this.sequence = result; },
      error => { throw error; }
    );
  }

  onGetElement(value: any) {
    this.sequence = value;
  }
}

