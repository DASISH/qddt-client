import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-toc',
  moduleId: module.id,
  template: `
<div class="col hide-on-small-only m1 l1">
  <div style="top: 55;" class="toc-wrapper pinned">
    <h5>{{tocName}}</h5>
    <ul class="section table-of-contents">
      <li><a href="home#topMenu">To the top </a> </li>
      <li *ngFor="let element of elements"><a href="home#{{element.id}}">{{element.name}}</a></li>
    </ul>
  </div>
</div>
`,
  providers: []
})
export class TocComponent  {
  @Input() tocName:string;
  @Input() elements: any[];
}
