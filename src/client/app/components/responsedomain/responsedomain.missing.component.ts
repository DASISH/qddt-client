import { Component, Input } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';

@Component({
  selector: 'qddt-responsedomain-missing',
  moduleId: module.id,
  template: `<div class="row grey lighten-4" *ngIf="responseDomain">
    <div *ngIf="responseDomain.managedRepresentation.children">
		  <span>Missing</span>
			<ul class="row">
			  <li *ngFor="let category of responseDomain.managedRepresentation.children; let i = index;" class="row">
          <input name="{{responseDomain.id}}-missing-group" type="radio"
            id="{{responseDomain.id}}code{{i}}"/>
          <label [attr.for]="responseDomain.id + 'code' + i">{{category?.label}}</label>
          <span class="s1 right"> {{category?.code?.codeValue}} </span>
        </li>
			</ul>
		</div>
    </div>`,
  styles: [],
})

export class ResponsedomainMissingComponent {
  @Input() responseDomain: ResponseDomain;

}
