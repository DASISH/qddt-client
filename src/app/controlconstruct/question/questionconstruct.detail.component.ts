import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-control-construct-detail',
  moduleId: module.id,
  templateUrl: './questionconstruct.detail.component.html',
})

export class QuestionConstructDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }

}
