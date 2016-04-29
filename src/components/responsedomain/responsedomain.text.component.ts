import {Component, Input} from 'angular2/core';

@Component({
  selector: 'responsedomain-text',
  moduleId: module.id,
  template: `<div class="row">
               <span>
               <label>{{label}}
               <textarea  class="materialize-textarea"></textarea></label>
               </span>
             </div>`,
  styles: [],
  pipes: [],
  directives: []
})

export class ResponsedomainTextComponent {
  @Input() label: string;
}
