import {Component, Input} from 'angular2/core';
@Component({
  selector: 'responsedomain-missing',
  moduleId: module.id,
  template: `<div class="row">
             <span>
               <label>{{label}}</label>
               </span>
             </div>`,
  styles: [],
  pipes: [],
  directives: []
})

export class ResponsedomainMissingComponent {
  @Input() label: string;
}
