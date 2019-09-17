import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-publication-detail',

  templateUrl: './publication.detail.component.html',
})

export class PublicationDetailComponent {
  @ViewChild('detail', {static: true}) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

