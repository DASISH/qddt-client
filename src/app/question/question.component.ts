import { Component, ViewChild } from '@angular/core';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'qddt-questionitem',
  moduleId: module.id,
  templateUrl: './question.component.html',
})

export class QuestionComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
