import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-missing',

  templateUrl: './missing.component.html'
})
export class MissingComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
