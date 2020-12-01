import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-question-construct-detail',

  templateUrl: './question-construct.detail.component.html',
})

export class QuestionConstructDetailComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(event) {
    this.templateDetail.goBack();
  }

}
