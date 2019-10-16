import { Component, Input } from '@angular/core';
import {Category} from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-missing',

  template: `<div *ngIf="missing?.children">
      <span>Missing</span>
			<ul class="row">
			  <li *ngFor="let category of missing.children; let i = index;" class="row">
          <input name="{{missing.name}}" type="radio"/>
          <label>{{ category?.label }}</label>
          <span class="s1 right"> {{ category?.code?.codeValue }} </span>
        </li>
			</ul>
    </div>`,
  styles: [],
})

export class ResponsedomainMissingComponent {
  @Input() managedRepresentation: Category;

  public get missing() {
    if (this.managedRepresentation.categoryType === 'MISSING_GROUP'){
      return this.managedRepresentation;
    }
    return this.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

}
