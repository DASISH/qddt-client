import { Component, ViewChild } from '@angular/core';
// import { MaterializeAction } from 'angular2-materialize';


@Component({
  selector: 'qddt-responsedomain-detail',

  templateUrl: './responsedomain.detail.component.html',
})
export class ResponseDetailComponent {
  @ViewChild('detail', {static: true}) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }

}
