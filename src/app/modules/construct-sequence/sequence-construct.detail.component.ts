import { Component,  ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-sequence-detail',

  templateUrl: './sequence-construct.detail.component.html',
})


export class SequenceDetailComponent  {
  @ViewChild('detail', {static: false}) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}
