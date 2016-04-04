import {Component, Input} from 'angular2/core';

@Component({
  selector: 'concept-children-list',
  moduleId: module.id,
  directives: [ConceptChildrenList],
  template: `
  <div *ngIf="isVisible">
    <div>
       <ul class="collection">
         <li *ngFor="#child of children"  class="collection-item avatar">
           <i class="material-icons circle green">insert_chart</i>
             <span class="title">{{child.name}}</span>
             <p>{{child.description}} <br> {{child.modified}} </p>
             <concept-children-list [isVisible]="isVisible" [children]="child.children"></concept-children-list>
          </li>
        </ul>
    </div>
  </div>

  `,
  providers: []
})
export class ConceptChildrenList {

  @Input() children: Array<any>;
  @Input() isVisible: boolean;

}
