import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Concept, IMoveTo } from '../../../classes';

@Component({
  selector: 'qddt-concept-toc',
  providers: [],
  styles: [
    '.toc-children { padding-left: 20px }',
    'li a:hover:after { content: " (drag me)"; }',
    'ul.over { border: 2px dashed #000;}',
  ],
  template: `
    <ul [ngClass]="{ 'toc-children': (level > 0) }" >
      <li *ngFor="let concept of concepts" draggable="true"
      (dragstart)="onDragstart($event, concept)"
      (drop)="onDrop($event, concept.id)"
      (dragover)="onDragover($event)"
      (dragleave)="onDragleave($event)">
        <a *ngIf="concept.name" href="concept#{{concept.id}}">
          <span *ngIf="level > 0" class=" blue-grey-text" [ngClass]="'text-lighten-' + level">{{ concept.name }}</span>
          <span *ngIf="level === 0" class=" blue-grey-text" [ngClass]="'text-lighten-' + level"><b>{{ concept.name }}</b></span>
        </a>
        <qddt-concept-toc *ngIf="concept.children?.length > 0" [concepts]=concept.children [level]="level+1"></qddt-concept-toc>
      </li>
    </ul>
  `
})

export class ConceptTocComponent {
  @Input() concepts: Concept[];
  @Input() level: number;
  @Output() conceptMoved =  new EventEmitter<IMoveTo>();


  private before = false;

  onDragstart(e, element) {
    console.log('drag ' + element.id);

    e.dataTransfer.effectAllowed = 'move'; // only dropEffect='copy' will be dropable
    e.dataTransfer.setData('text/plain', element.id); // required otherwise doesn't work
  }

  onDragover(e) {
    e.dataTransfer.dropEffect = 'move';
    if (e.preventDefault) { e.preventDefault(); } // allows us to drop
    const bounding = e.target.getBoundingClientRect();
    const offset = bounding.y + (bounding.height / 2 );
    if ( e.clientY - offset > 0 ) {
        this.before = false;
        e.target.style['border-bottom'] = 'solid 4px blue';
        e.target.style['border-top'] = '';
    } else {
      this.before = true;
      e.target.style['border-top'] = 'solid 4px blue';
        e.target.style['border-bottom'] = '';
    }
    return true;
  }

  onDragleave(event) {
    event.target.style['border-bottom'] = '';
    event.target.style['border-top'] = '';
  }

  onDrop(e, target) {
    e.target.style['border-bottom'] = '';
    e.target.style['border-top'] = '';
    const source = e.dataTransfer.getData('text');
    e.dataTransfer.clearData();
    if (e.stopPropagation) { e.stopPropagation(); } // stops the browser from redirecting...why???
    this.conceptMoved.emit( { before: this.before, target: target, source: source });
  }


}
