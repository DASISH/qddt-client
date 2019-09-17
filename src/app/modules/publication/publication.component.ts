import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-publication',

  templateUrl: './publication.component.html'
})
export class PublicationComponent  {
  @ViewChild('detail', {static: true}) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
