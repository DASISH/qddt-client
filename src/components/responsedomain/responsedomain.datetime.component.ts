import {Component, Input} from 'angular2/core';

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
  pipes: [],
  directives: []
})

export class ResponsedomainDatetimeComponent {
  @Input() start: string;
}
