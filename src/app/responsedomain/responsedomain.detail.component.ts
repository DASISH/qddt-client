import { Component, ViewChild } from '@angular/core';
// import { MaterializeAction } from 'angular2-materialize';


@Component({
  selector: 'qddt-responsedomain-detail',
  moduleId: module.id,
  templateUrl: './responsedomain.detail.component.html',
})
export class ResponseDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }

}
