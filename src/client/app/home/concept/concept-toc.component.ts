import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-concept-toc',
  providers: [],
  styles: [
    '.toc-children { padding-left: 20px }',
  ],
  template: `
    <ul [ngClass]="{ 'toc-children': (level > 0) }" *ngFor="let concept of concepts">
      <li>
        <a *ngIf="concept.name" href="home#{{concept.id}}">
          <span *ngIf="level > 0" class=" blue-grey-text" [ngClass]="'text-lighten-' + level">{{ concept.name }}</span>
          <span *ngIf="level === 0" class=" blue-grey-text" [ngClass]="'text-lighten-' + level"><b>{{ concept.name }}</b></span>
        </a>
        <qddt-concept-toc [concepts]=concept.children [level]="level+1"></qddt-concept-toc>
      </li>
    </ul>
  `
})

export class ConceptTocComponent {
  @Input() concepts: any;
  @Input() level: number;
}
