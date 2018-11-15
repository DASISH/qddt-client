import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-questionitem-detail',

  templateUrl: './question.detail.component.html',
})
export class QuestionDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }

}
