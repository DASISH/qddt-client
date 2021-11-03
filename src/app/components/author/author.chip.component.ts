import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-author-chip',

  template: `
  <div *ngIf="authors">
    <label>Authors</label>
    <br>
    <div class="chip" *ngFor="let author of authors">
      <ng-container *ngIf="author.picture; else elseTemplate">
      <img src="{{author.picture}}" si >
      </ng-container>
      <ng-template #elseTemplate>
      <i class="material-icons" style="font-size: 20px; vertical-align: text-bottom;">person</i>
      </ng-template>
      <a *ngIf="!author.email && !author.homepage">{{ author?.name }}</a>
      <a *ngIf="author.email" href="mailto:{{author.email}}">{{ author?.name }}</a>
      <a *ngIf="author.homepage && !author.email" href="{{author?.homepage}}" target="_blank">{{ author.name }}</a>
    </div>
  </div>
 `
})
export class AuthorChipComponent {

  @Input() authors: any;

}
