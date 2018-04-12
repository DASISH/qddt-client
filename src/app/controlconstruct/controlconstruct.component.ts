import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-control-construct',
  moduleId: module.id,
  providers: [],
  templateUrl: './controlconstruct.component.html',
})

export class ControlConstructComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    console.log(event);
    this.templateDetail.onToggleForm();
  }
}
