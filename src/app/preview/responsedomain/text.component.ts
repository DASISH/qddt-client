import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../responsedomain/responsedomain.classes';
import { Category } from '../../lookups/category/category.classes';

@Component({
  selector: 'qddt-preview-rd-text',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="managedRepresentation">
       <textarea id="{{managedRepresentation?.id}}-textarea"
                 [attr.data-length]=high
                 [attr.maxlength]=high
         class="materialize-textarea"  materialize="characterCounter" validate></textarea>
       <label>Text length from {{ low }} to {{ high }}</label>
     </div>`,
  styles: [],
})

export class ResponsedomainTextComponent implements OnChanges {
  @Input() managedRepresentation: Category;
  low = 0;
  high = 20;

  ngOnChanges() {
    const rep = this.managedRepresentation;
    if (rep) {
      if (rep.inputLimit.maximum) {
          this.high = +rep.inputLimit.maximum;
      }
      if (rep.inputLimit.minimum) {
          this.low = +rep.inputLimit.minimum;
      }
    }
  }
}
