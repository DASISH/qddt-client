import { Component,  ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-sequence-detail',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.detail.component.html',
})


export class SequenceDetailComponent  {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}
