import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeLogJson, TemplateService } from '../../lib';

//

@Component({
  selector: 'qddt-changelog-form',
  templateUrl: './changelog.form.component.html'
})

export class ChangeLogFormComponent implements OnChanges {
  @Input() changelog: ChangeLogJson;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<string>();

  public formId = Math.round(Math.random() * 10000);


  constructor(private service: TemplateService) { }

  onSave() {
    console.log('This service doesn\'t provide persisting.');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.changelog.currentValue) {
      if (this.changelog) {
        M.updateTextFields();
      }
    }
  }

}
