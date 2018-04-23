import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-question-construct',
  moduleId: module.id,
  providers: [],
  templateUrl: './question-construct.component.html',
})

export class QuestionConstructComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    console.log(event);
    this.templateDetail.onToggleForm();
  }
}