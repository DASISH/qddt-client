import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserResponse } from 'src/app/lib';

@Component({
  selector: 'qddt-preview-rd-grid',

  styles: [
    `:host ::ng-deep .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  template: `
<div *ngIf="responseDomain" >
  <!--<qddt-responsedomain-scale [responseDomain]="responseDomain" [ ></qddt-responsedomain-scale>-->
</div>`,
  providers: [],
})

export class PreviewResponseDomainGridComponent {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() responseDomain: any;


  public onSelectedEvent(idxs: UserResponse[]) {
    this.selectedEvent.emit(idxs);
  }
}
