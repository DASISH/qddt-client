import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {ChangeLogJson} from './changelog.classes';
import {TemplateService} from '../../components/template';

// declare var Materialize: any;

@Component({
  selector: 'qddt-changelog-form',
  templateUrl: './changelog.form.component.html'
})

export class ChangeLogFormComponent implements OnInit, OnChanges {
  @Input() changelog: ChangeLogJson;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public formId = Math.round( Math.random() * 10000);


  constructor(private service: TemplateService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['changelog'].currentValue) {
      if (this.changelog) {
        // Materialize.updateTextFields();
      }
    }
  }

}
