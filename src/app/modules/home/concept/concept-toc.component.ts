import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Concept, Topic } from '../../../lib';

@Component({
  selector: 'qddt-concept-toc',
  template: `
<ng-template #nodeTemplateRef let-children="source" >
  <li *ngFor="let child of children" cdkDrag (click)="isActive=child.id" >
    <a [ngClass]="{'active':isActive===child.id}" href="concept#{{child.id}}" >{{ child.name | titlecase  }}</a>
    <ol *ngIf="child.children">
      <ng-template
        [ngTemplateOutlet]="nodeTemplateRef"
        [ngTemplateOutletContext]="{ source: child.children }">
      </ng-template>
    </ol>
  </li>
</ng-template>

<!-- Initiate the recursive template rendering. -->

<div class="toc-wrapper pinned" style="height: 100%; overflow-y: auto;" >
  <h5>Concept Toc</h5>
  <div cdkDropList cdkDrop [cdkDropListData]="topic.concepts" (cdkDropListDropped)="onItemDrop($event)">
    <ol class="section table-of-contents">
      <ng-template
        [ngTemplateOutlet]="nodeTemplateRef"
        [ngTemplateOutletContext]="{ source: topic.concepts }">
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
