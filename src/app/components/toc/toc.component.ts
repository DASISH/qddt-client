import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-toc',
  // styleUrls: ['./toc.component.css', ],
  styles: ['li.over { border-color: #333; background: #ccc; }'],
  template: `
<div class="col m3 hide-on-small-only">
  <div class="toc-wrapper pinned" style="height: 100%; overflow-y: auto;" >
    <h5>{{path | titlecase }} Toc</h5>
    <ol id="drags" class="section table-of-contents"
    (dragover)="onDragover($event)"
    (dragenter)="onDragenter($event)"
    (drop)="onDrop($event)" >
      <li *ngFor="let element of elements; let i = index"  draggable="true"
        (dragstart)="onDragstart($event, element)" (click)="isActive=i">
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

  public isActive: number;

  constructor() { }
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
