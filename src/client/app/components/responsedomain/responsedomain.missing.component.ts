import { Component, Input } from '@angular/core';
@Component({
  selector: 'responsedomain-missing',
  moduleId: module.id,
  template: `<div class="row">
             <span>
               <label>{{label}}</label>
               </span>
             </div>`,
  styles: [],
})

export class ResponsedomainMissingComponent {
  @Input() label: string;
}
