import { Component, Input } from '@angular/core';
import {Category} from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-missing',

  template: `
<div *ngIf="missing?.children">
  <span style="font-weight: bold;"><label>Missing</label></span>
  <ul>
    <li *ngFor="let category of missing.children; let i = index;" >
      <label>
        <input name="{{missing.name}}" type="radio"/>
        <span >{{category.label}}</span>
      </label>
      <label class="right"> {{ category.code?.codeValue }} </label>
    </li>
  </ul>
</div>`,
  styles: [],
})

export class ResponsedomainMissingComponent {
  @Input() managedRepresentation: Category;

  public get missing() {
    if (this.managedRepresentation.categoryType === 'MISSING_GROUP') {
      return this.managedRepresentation;
    }
    return this.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

}
