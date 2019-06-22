import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'qddt-sequence-construct',

  providers: [],
  templateUrl: './sequence-construct.component.html',
})

export class SequenceConstructComponent  {
  @ViewChild('detail', {static: true}) templateDetail;


  public onFormModified(event) {
    console.log(event);
    this.templateDetail.onToggleForm();
  }
}
