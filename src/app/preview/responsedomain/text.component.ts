import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../responsedomain/responsedomain.service';

@Component({
  selector: 'qddt-preview-rd-text',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="responseDomain">
       <textarea id="{{responseDomain?.id}}-textarea"
                 [attr.data-length]=high
                 [attr.maxlength]=high
         class="materialize-textarea"  materialize="characterCounter" validate></textarea>
       <label>Text length from {{ low }} to {{ high }}</label>
     </div>`,
  styles: [],
})

export class ResponsedomainTextComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;
  low = 0;
  high = 20;

  ngOnChanges() {
    const rep = this.responseDomain.managedRepresentation;
    if (rep) {
      if (rep.inputLimit.maximum) {
        if (typeof rep.inputLimit.maximum === 'string') {
          this.high = parseInt(rep.inputLimit.maximum);
        } else {
          this.high = rep.inputLimit.maximum;
        }
      }
      if (rep.inputLimit.minimum) {
        if (typeof rep.inputLimit.minimum === 'string') {
          this.low = parseInt(rep.inputLimit.minimum);
        } else {
          this.low = rep.inputLimit.minimum;
        }
      }
    }
  }
}
