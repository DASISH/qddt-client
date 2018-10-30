import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-instruction-detail',

  templateUrl: './instruction.detail.component.html',
})

export class InstructionDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

