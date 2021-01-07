import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-question-construct',

  providers: [],
  templateUrl: './question-construct.component.html',
})

export class QuestionConstructComponent {
  @ViewChild('detail', { static: true }) templateDetail;


  public onFormModified(event) {
    // console.debug(event);
    this.templateDetail.onToggleForm();
  }
}
