import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../../components/responsedomain/responsedomain.service';

@Component({
  selector: 'qddt-preview-rd-text',
  moduleId: module.id,
  template: `<div class="row" *ngIf="responseDomain">
               <textarea id="{{responseDomain?.id}}-textarea"
                 class="materialize-textarea" [attr.maxlength]="high"></textarea>
               <label>Text length from {{low}} to {{high}}</label>
             </div>`,
  styles: [],
})

export class ResponsedomainTextComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;
  low: number;
  high: number;

  ngOnChanges() {
    this.low = 0;
    this.high = 20;
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined) {
      if (rep.inputLimit !== undefined
        && rep.inputLimit.maximum !== undefined) {
        this.high = parseInt(rep.inputLimit.maximum);
      }
      if (rep.inputLimit !== undefined
        && rep.inputLimit.minimum !== undefined) {
        this.low = parseInt(rep.inputLimit.minimum);
      }
    }
  }
}
