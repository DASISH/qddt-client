import {Component, Input} from 'angular2/core';
import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'concept-children-list',
  moduleId: module.id,
  directives: [ConceptChildrenList],
  pipes: [LocalDatePipe],
  template: `
  <div *ngIf="isVisible">
    <div>
       <ul class="collection">
         <li *ngFor="#child of concept.children"  class="collection-item avatar">
           <i class="material-icons circle green">insert_chart</i>
             <span class="title">{{child.name}}</span>
             <p>{{child.description}} <br> {{child.modified | localDate}} </p>
             <concept-children-list [isVisible]="isVisible" [concept]="child"></concept-children-list>
          </li>
        </ul>
    </div>
  </div>

  `,
  providers: []
})
export class ConceptChildrenList {

  @Input() concept: any;
  @Input() isVisible: boolean;

}
