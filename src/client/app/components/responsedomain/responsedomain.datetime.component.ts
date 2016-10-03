import { Component, Input } from '@angular/core';

@Component({
  selector: 'responsedomain-datetime',
  moduleId: module.id,
  template: `<div class="row">
               <span>
               <label>{{start}}
               <input  type="date" class="datepicker"/></label>
               </span>
             </div>`,
  styles: [],
})

export class ResponsedomainDatetimeComponent {
  @Input() start: string;
}
