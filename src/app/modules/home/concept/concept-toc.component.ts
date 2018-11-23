import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Concept, IMoveTo, Topic } from '../../../classes';

@Component({
  selector: 'qddt-concept-toc',
  providers: [],
  styles: [
    '.toc-children { padding-left: 20px }',
    'li a:hover:after { content: " (drag me)"; }',
  ],
  template: `
    <ul *ngIf="children.length" [ngClass]="{ 'toc-children': (level > 0) }"  (drop)="onDrop($event, -1)">
      <li *ngFor="let concept of children; let idx = index;" draggable="true"
          (dragstart)="onDragstart($event, concept.id)"
          (dragover)="onDragover($event)"
          (dragleave)="onDragleave($event)"
          (drop)="onDrop($event, idx)">
        <a href="concept#{{concept.id}}">
          <span class="blue-text" [ngClass]="'text-lighten-' + level"><b>{{ concept.name }}</b></span>
        </a>
        <qddt-concept-toc
            [level]="level+1" [rootNode]="conceptClass(concept)" (conceptMoved)="conceptMoved.emit($event)">
        </qddt-concept-toc>
      </li>
    </ul>
  `
})

export class ConceptTocComponent implements OnChanges {
  @Input() rootNode: Topic|Concept;
  @Input() level: number;
  @Output() conceptMoved =  new EventEmitter<IMoveTo>();


  onDragstart(event, sourceId) {
    event.dataTransfer.effectAllowed = 'move'; // only dropEffect='copy' will be dropable
    event.dataTransfer.setData('text/plain', sourceId); // required otherwise doesn't work
    event.stopPropagation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rootNode.previousValue === null) {
    console.log( 'hierarchy changed? ' + changes.rootNode.currentValue );
    }
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
    this.conceptMoved.emit( { target: this.rootNode.id, index: index, source: sourceId } as IMoveTo);
  }

  public get children(): Concept[] {
    if (this.rootNode instanceof Topic) {
      return this.rootNode.concepts || [];
    } else if (this.rootNode instanceof Concept) {
      return this.rootNode.children || [];
    } else {
      return [];
    }
  }

  public conceptClass(seed): Concept {
    return new Concept(seed);
  }

}
