import { HierarchyPosition } from './../../lib/enums/hierarchy-position';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'qddt-toc',
  // styleUrls: ['./toc.component.css', ],
  styles: ['li.over { border-color: #333; background: #ccc; }'],
  template: `
<div class="col m3 hide-on-small-only">
  <div class="toc-wrapper pinned" style="height: 100%; overflow-y: auto;" >
    <h5>{{path | titlecase }} Toc</h5>
    <div cdkDropList cdkDrop [cdkDropListData]="elements"
          (cdkDropListDropped)="onItemDrop($event)">
    <ol class="section table-of-contents">
      <li *ngFor="let element of elements; let i = index;" cdkDrag (click)="isActive=i">
        <a [ngClass]="{'active':isActive===i}" href="{{path}}#{{element.id}}" >{{ element.name }}</a>
      </li>
    </ol>
  </div>
</div>
`,
  providers: []
})
export class TocComponent {
  @Input() path: string;
  @Input() elements: any[];
  @Output() hierarchyChanged = new EventEmitter<any>();

  public isActive: number;

  constructor() { }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      console.log('moving');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.hierarchyChanged.emit(true);
    }
  }
}
