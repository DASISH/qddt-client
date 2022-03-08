import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-author-chip',
  styles:['i.material-icons {font-size: 20px; vertical-align: text-bottom;}'],
  template: `
  <div *ngIf="authors">
    <label>Authors</label>
    <br>
    <div class="chip" *ngFor="let author of authors" title="{{author.about}}">
      <ng-container *ngIf="author.pictureUrl; else elseTemplate">
      <img src="{{author.pictureUrl}}">
      </ng-container>
      <ng-template #elseTemplate>
      <i class="material-icons">person</i>
      </ng-template>
      <a *ngIf="!author.email && !author.homepage">{{ author?.name }}</a>
      <a *ngIf="author.email" href="mailto:{{author.email}}" title="{{author.email}}"><i class="material-icons">email</i> {{ author.name }} </a>
      <a *ngIf="author.homepageUrl" href="{{author.homepageUrl}}"  title="{{author.homepageUrl}}" target="_blank"><i class="material-icons">web</i> About </a>
      <a *ngIf="author.authorsAffiliation" href="{{author.authorsAffiliation}}"  title="{{author.authorsAffiliation}}" target="_blank"><i class="material-icons">web</i> Affiliation </a>

    </div>
  </div>
 `
})
export class AuthorChipComponent {

  @Input() authors: any;

}
