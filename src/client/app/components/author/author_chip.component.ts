import { Component, Input } from '@angular/core';

@Component({
  selector: 'author-chip',
  moduleId: module.id,
  template: `  
  <div *ngIf="authors">
    <div class="chip" *ngFor="let author of authors">
      <img src="{{author.picture}}">
      <a *ngIf="!author.email && !author.homepage">{{author.name}}</a>
      <a *ngIf="author.email" href="mailto:{{author.email}}">{{author.name}}</a>
      <a *ngIf="author.homepage && !author.email" href="{{author.homepage}}" target="_blank">{{author.name}}</a>
    </div>
  </div>
 `
})
export class AuthorChipComponent {

  @Input() authors:any;


  onAdd() {
    console.log('added clicked');
  }
}
