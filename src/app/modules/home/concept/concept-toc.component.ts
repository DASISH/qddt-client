import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Concept, IMoveTo } from '../../../lib';

@Component({
  selector: 'qddt-concept-toc',
  providers: [],
  styles: [
    // '.toc-children { padding-left: 10px }',
    'ol { list-style-type: none; counter-reset: item; margin: 0; padding: 0; }',
    'ol > li { display: table; counter-increment: item; margin-bottom: 0.6em; }',
    'ol > li:before { content: counters(item, ".") ". "; display: table-cell; padding-right: 0.6em; }',
    'li ol > li { margin: 0; }',
    'li ol > li:before { content: counters(item, ".") " "; }',
    'li a:hover { color: blue; }',
    'a { color: #757575; }'
    // 'li a:hover:after { content: " (drag me)"; }',
  ],
  template: `
    <ol *ngIf="children?.length"  (drop)="onDrop($event, -1)">
      <li *ngFor="let concept of children; let idx = index;" draggable="true"
          (dragstart)="onDragstart($event, concept.id)"
          (dragover)="onDragover($event)"
          (dragleave)="onDragleave($event)"
          (drop)="onDrop($event, idx)">
        <a href="concept#{{concept.id}}">
          <span [ngClass]="'text-lighten-' + level">{{ concept.name | titlecase }}</span>
        </a>
        <qddt-concept-toc *ngIf="concept.children"
            [level]="level+1" [children]="concept.children" [parentId]= "concept.id" (conceptMoved)="conceptMoved.emit($event)">
        </qddt-concept-toc>
      </li>
    </ol>
  `
})

export class ConceptTocComponent {
  @Input() children: Concept[];
  @Input() parentId: string;
  @Input() level: number;
  @Output() conceptMoved =  new EventEmitter<IMoveTo>();


  onDragstart(event, sourceId) {
    event.dataTransfer.effectAllowed = 'move'; // only dropEffect='copy' will be dropable
    event.dataTransfer.setData('text/plain', sourceId); // required otherwise doesn't work
    event.stopPropagation();
  }

  onDragover(event) {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();

    const bounding = event.target.getBoundingClientRect();
    const offset = bounding.y + (bounding.height / 2 );
    if ( event.clientY - offset > 0 ) {
      event.target.style['border-bottom'] = 'solid 3px blue';
      event.target.style['border-top'] = '';
    } else {
      event.target.style['border-top'] = 'solid 3px blue';
      event.target.style['border-bottom'] = '';
    }
    return true;
  }

  onDragleave(event) {
    event.target.style['border-bottom'] = '';
    event.target.style['border-top'] = '';
  }

  onDrop(event, index) {
    event.stopPropagation();
    event.target.style['border-bottom'] = '';
    event.target.style['border-top'] = '';
    const sourceId = event.dataTransfer.getData('text');
    event.dataTransfer.clearData();
    console.log(event.currentTarget);
    console.log(event.target);
    this.conceptMoved.emit( { target: this.parentId , index: index, source: sourceId } as IMoveTo);
  }

  public conceptClass(seed): Concept {
    return new Concept(seed);
  }

}
