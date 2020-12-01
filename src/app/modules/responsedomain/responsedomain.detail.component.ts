import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-responsedomain-detail',

  templateUrl: './responsedomain.detail.component.html',
})
export class ResponseDetailComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(event) {
    this.templateDetail.goBack();
  }

}
