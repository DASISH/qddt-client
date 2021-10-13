import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Topic } from '../../../lib';

@Component({
  selector: 'qddt-concept-toc',
  styles: ['ol {padding-left: 20px;}',
    'a {padding-left: 4px; color: #757575;}',
    'a.active { padding-left: 4px;}',
    'a:hover  { padding-left: 4px;}',
    'ol { list-style-type: none; counter-reset: item; margin: 0; padding: 0; padding-inline-start: 5px; }',
    'ol > li { display: table; counter-increment: item; }',
    'ol > li:before { content: counters(item, ".") ". "; display: table-cell; padding-right: 0.3em; }',
    'li ol > li { margin: 0; }',
    'li ol > li:before { content: counters(item, ".") " "; }',
    'li a:hover { color: blue; }',

    // 'ol { list-style-type:none;counter-reset:list;}',
    // 'ol li:before { counter-increment:list;content: counters(list, ".") ". ";}'
  ],
  template: `
<ng-template #nodeTemplateRef let-children="source" >
  <li *ngFor="let child of children" cdkDrag >
    <a [ngClass]="{'active':isActive===child.id}" href="concept#{{child.id}}" (click)="isActive=child.id" >{{ child.label ?? child.name | titlecase  }}</a>
    <ol *ngIf="child.children.length > 0">
      <ng-template
        [ngTemplateOutlet]="nodeTemplateRef"
        [ngTemplateOutletContext]="{ source: child.children }">
      </ng-template>
    </ol>
  </li>
</ng-template>

<!-- Initiate the recursive template rendering. -->

<div class="toc-wrapper pinned" style="height: calc(100% - 64px); overflow-y: auto;" >
  <h5>Concept Toc</h5>
  <div cdkDropList cdkDrop [cdkDropListData]="topic.children" (cdkDropListDropped)="onItemDrop($event)">
    <ol class="section table-of-contents">
      <ng-template
        [ngTemplateOutlet]="nodeTemplateRef"
        [ngTemplateOutletContext]="{ source: topic.children }">
      </ng-template>
    </ol>
  </div>
</div>
`
})

export class ConceptTocComponent {
  @Input() topic: Topic;
  @Output() hierarchyChanged = new EventEmitter<any>();

  public isActive: string;

  constructor() { }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.hierarchyChanged.emit(true);
    }
  }
}
