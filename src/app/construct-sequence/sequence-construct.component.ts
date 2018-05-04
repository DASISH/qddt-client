import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-sequence-construct',
  moduleId: module.id,
  providers: [],
  templateUrl: './sequence-construct.component.html',
})

export class SequenceConstructComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    console.log(event);
    this.templateDetail.onToggleForm();
  }
}
