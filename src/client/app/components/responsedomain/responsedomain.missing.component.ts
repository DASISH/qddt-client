import { Component, Input } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';

@Component({
  selector: 'responsedomain-missing',
  moduleId: module.id,
  template: `<div class="row">
             <span>
               <label>{{responseDomain.name}}</label>
               </span>
             </div>`,
  styles: [],
})

export class ResponsedomainMissingComponent {
  @Input() responseDomain: ResponseDomain;
}
