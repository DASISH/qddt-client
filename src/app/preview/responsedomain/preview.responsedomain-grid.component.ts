import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-rd-grid',

  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  template: `
<div *ngIf="responseDomain" >
  <!--<qddt-responsedomain-scale [responseDomain]="responseDomain" [ ></qddt-responsedomain-scale>-->
</div>`,
  providers: [ ],
})

export class PreviewResponseDomainGridComponent {
  @Input() responseDomain: any;


}
