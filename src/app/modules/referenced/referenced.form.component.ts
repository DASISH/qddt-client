import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ReferencedJson, TemplateService } from '../../lib';

//

@Component({
  selector: 'qddt-referenced-form',
  templateUrl: './referenced.form.component.html'
})

export class ReferencedFormComponent implements OnChanges {
  @Input() referenced: ReferencedJson;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<string>();

  public formId = Math.round(Math.random() * 10000);


  constructor(private service: TemplateService) { }

  onSave() {
    console.log('notin done...');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.referenced.currentValue) {
      if (this.referenced) {
        M.updateTextFields();
      }
    }
  }

}
