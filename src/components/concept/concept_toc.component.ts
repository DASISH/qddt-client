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
      <li><a *ngIf="concept.name" href="#{{concept.id}}">{{concept.name}}</a>
      <concept-toc [concepts]=concept.children></concept-toc>
      </li>
    </ul>
  `
})

export class ConceptTocComponent {
  @Input() concepts: any;
}
