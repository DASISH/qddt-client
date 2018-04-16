import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-category',
  moduleId: module.id,
  templateUrl: './missing-group.component.html'
})
export class MissingGroupComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
