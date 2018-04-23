import { Component, ViewChild } from '@angular/core';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'qddt-responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
})

export class ResponseComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
