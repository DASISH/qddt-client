import { Component, Input } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'qddt-toc',
  styleUrls: ['./toc.component.css', ],
  template: `
<div class="col hide-on-small-only m1 l1">
  <div style="top: 55;" class="toc-wrapper pinned">
    <h5>{{path | titlecase }} Toc</h5>
    <ul id="drags" class="section table-of-contents" style="padding:3;"
    (dragover)="onDragover($event)"
    (dragenter)="onDragenter($event)"
    (drop)="onDrop($event)" >
      <li *ngFor="let element of elements" (drop)="onDrop($event)">
      <a href="{{path}}#{{element.id}}" draggable="true" (dragstart)="onDragstart($event, element)">
      {{ element.name }}</a>
      </li>
    </ul>
  </div>
</div>
`,
  providers: []
})
export class TocComponent  {
  @Input() path: string;
  @Input() elements: any[];

  constructor(  ) {}
  // <a (click)="scrollto(element.id)">{{ element.name }}</a>
//   <a routerLink="." fragment="{{element.id}}" queryParamsHandling="merge">{{ element.name }}</a>
  // public scrollto(tag: string) {
  //   this.viewportScroller.scrollToAnchor(tag);
  // }

  onDragstart(e, element) {
    console.log(e);
    e.dataTransfer.effectAllowed = 'move'; // only dropEffect='copy' will be dropable
    e.dataTransfer.setData('text/plain', element.id); // required otherwise doesn't work
  }

  onDragover(e) {
    // console.log(e);
    if (e.preventDefault) { e.preventDefault(); } // allows us to drop
    // this.className = 'over';
    e.dataTransfer.dropEffect = 'move';
    return true;
  }

  onDragenter(e) {
    console.log(e);
    // this.className = 'over';
    return true;
  }

  onDragleave() {
    console.log('leave');
    // this.className = '';
  }

  onDrop(e) {
    console.log(e);
    if (e.stopPropagation) { e.stopPropagation(); } // stops the browser from redirecting...why???
  }
}
