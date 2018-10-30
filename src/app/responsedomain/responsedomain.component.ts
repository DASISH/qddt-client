import { Component, ViewChild } from '@angular/core';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'qddt-responsedomain',

  templateUrl: './responsedomain.component.html',
})

export class ResponseComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
