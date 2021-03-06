import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-universe',

  templateUrl: './universe.component.html'
})
export class UniverseComponent  {
  @ViewChild('detail', {static: true}) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
