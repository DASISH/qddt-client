import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-questionitem',

  templateUrl: './question.component.html',
})

export class QuestionComponent {
  @ViewChild('detail', {static: false}) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
