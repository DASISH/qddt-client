import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Concept, IMoveTo, Topic } from '../../../lib';

@Component({
  selector: 'qddt-concept-toc',
  providers: [],
  styles: [
    // '.toc-children { padding-left: 10px }',
    'ol { list-style-type: none; counter-reset: item; margin: 0; padding: 0; padding-inline-start: 5px; }',
    'ol > li { display: table; counter-increment: item; }',
    'ol > li:before { content: counters(item, ".") ". "; display: table-cell; padding-right: 0.3em; }',
    'li ol > li { margin: 0; }',
    'li ol > li:before { content: counters(item, ".") " "; }',
    'li a:hover { color: blue; }',
    'a { color: #757575; }'
    // 'li a:hover:after { content: " (drag me)"; }',
  ],
  template: `
<ng-template #nodeTemplateRef   let-children="source" >
  <ol (drop)="onDrop($event, -1)">
    <ng-template ngFor let-child [ngForOf]="children">
    <li draggable="true"
        (dragstart)="onDragstart($event, child.id)"
        (dragover)="onDragover($event)"
        (dragleave)="onDragleave($event)"
        (drop)="onDrop($event, child.id)">
      <a [ngClass]="{'active':isActive===child.id}" href="concept#{{child.id}}" (click)="isActive=child.id">
        <span>{{ child.name | titlecase }}</span>
      </a>
        <!-- Invoke the recursive template. -->
      <ng-template
        [ngTemplateOutlet]="nodeTemplateRef"
        [ngTemplateOutletContext]="{ source: child.children }">
      </ng-template>
    </li>
    </ng-template>
  </ol>
</ng-template>

<!-- Initiate the recursive template rendering. -->
<ng-template
  [ngTemplateOutlet]="nodeTemplateRef"
  [ngTemplateOutletContext]="{ source: topic.concepts }">
</ng-template>
`
})

export class ConceptTocComponent {
  @Input() topic: Topic;
  @Output() conceptMoved = new EventEmitter<IMoveTo>();

  public isActive: string;

  onDragstart(event, sourceId) {
    event.dataTransfer.effectAllowed = 'move'; // only dropEffect='copy' will be dropable
    event.dataTransfer.setData('text/plain', sourceId); // required otherwise doesn't work
    event.stopPropagation();
  }

  onDragover(event) {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();

    const bounding = event.target.getBoundingClientRect();
    const offset = bounding.y + (bounding.height / 2);
    if (event.clientY - offset > 0) {
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
    this.conceptMoved.emit({ target: '1432', index, source: sourceId } as IMoveTo);
  }

}
