import { Component, Input } from '@angular/core';
import { ResponseDomain } from '../../responsedomain/responsedomain.classes';
import { Category } from '../../category/category.classes';

@Component({
  selector: 'qddt-preview-rd-missing',
  moduleId: module.id,
  template: `<div *ngIf="managedRepresentation?.children">
      <span>Missing</span>
			<ul class="row">
			  <li *ngFor="let category of managedRepresentation.children; let i = index;" class="row">
          <input name="{{managedRepresentation.id}}-list" type="radio"
            id="{{managedRepresentation.id}}code{{i}}"/>
          <label [attr.for]="managedRepresentation.id + 'code' + i">{{ category?.label }}</label>
          <span class="s1 right"> {{ category?.code?.codeValue }} </span>
        </li>
			</ul>
    </div>`,
  styles: [],
})

export class ResponsedomainMissingComponent {
  @Input() managedRepresentation: Category;

}
