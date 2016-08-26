import { Component, Input} from 'angular2/core';

@Component({
  selector: 'concept-toc',
  providers: [],
  directives: [ConceptTocComponent],
  pipes: [],
  styles: [
    '.toc-children { padding-left: 5px }',
  ],
  template: `
    <ul class="toc-children" *ngFor="#concept of concepts">
      <li>
        <a *ngIf="concept.name" href="#{{concept.id}}">
          <span *ngIf="level > 0" class=" blue-grey-text" [ngClass]="'text-lighten-' + level">{{concept.name}}</span>
          <span *ngIf="level === 0" class=" blue-grey-text" [ngClass]="'text-lighten-' + level"><b>{{concept.name}}</b></span>
        </a>
        <concept-toc [concepts]=concept.children [level]="level+1"></concept-toc>
      </li>
    </ul>
  `
})

export class ConceptTocComponent {
  @Input() concepts: any;
  @Input() level: number;
}
