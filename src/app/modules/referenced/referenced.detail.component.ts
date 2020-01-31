import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-referenced-detail',

  templateUrl: './referenced.detail.component.html',
})

export class ReferencedDetailComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

