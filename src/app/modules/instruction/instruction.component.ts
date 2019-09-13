import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-instruction',

  templateUrl: './instruction.component.html'
})
export class InstructionComponent  {
  @ViewChild('detail', {static: false}) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
