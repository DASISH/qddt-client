import { Component, Input } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';

@Component({
  selector: 'responsedomain-text',
  moduleId: module.id,
  template: `<div class="row">
               <div class="input-field col s12">
                 <textarea id="{{responseDomain.id}}-textarea" 
                   class="materialize-textarea" [attr.maxlength]="high"></textarea>
                 <label [attr.for]="responseDomain.id + '-textarea'" >{{responseDomain?.name}}</label>
               </div>
             </div>`,
  styles: [],
})

export class ResponsedomainTextComponent {
  @Input() responseDomain: ResponseDomain;
  private low: number;
  private high: number;

  ngOnInit() {
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
