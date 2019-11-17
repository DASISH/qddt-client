import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-instruction-detail',

  templateUrl: './instruction.detail.component.html',
})

export class InstructionDetailComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

