import { Component, ViewChild } from '@angular/core';
// import { MaterializeAction } from 'angular2-materialize';


@Component({
  selector: 'qddt-questionitem-detail',
  moduleId: module.id,
  templateUrl: './question.detail.component.html',
})
export class QuestionDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }

}
