import { Component, Input } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'qddt-toc',
  moduleId: module.id,
  template: `
<div class="col hide-on-small-only m1 l1">
  <div style="top: 55;" class="toc-wrapper pinned">
    <h5>{{path | titlecase }} Toc</h5>
    <ul class="section table-of-contents">
      <li *ngFor="let element of elements">
      <a href="{{path}}#{{element.id}}">{{ element.name }}</a>
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

}
