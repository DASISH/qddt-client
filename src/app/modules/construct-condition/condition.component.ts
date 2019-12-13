import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-condition',

  templateUrl: './condition.component.html'
})
export class ConditionComponent  {
  @ViewChild('detail', {static: true}) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
