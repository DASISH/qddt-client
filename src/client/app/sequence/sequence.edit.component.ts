import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SequenceService, Statement } from './sequence.service';

@Component({
  selector: 'qddt-sequence-edit',
  moduleId: module.id,
  templateUrl: 'sequence.edit.html',
  styles: [
  ]
})
export class SequenceEditComponent implements OnInit {
  @Output() element: any = new EventEmitter<any>();
  statement: any;
  elementId: string;

  constructor(private service: SequenceService) {
  }

  ngOnInit() {
    this.statement = new Statement();
    this.elementId = new Date().toString();
  }
}

