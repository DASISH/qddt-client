import {Component, Input, Output,EventEmitter} from 'angular2/core';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {AuthorListModalComponent} from './author_list_modal.component';


@Component({
  selector: 'author-chip-edit',
  moduleId: module.id,
  directives: [MaterializeDirective,AuthorListModalComponent],
  template: `  
    <author-list-modal (authorSelectedEvent)="onAuthorSelectedEvent($event)"></author-list-modal>
    <div class="chip" *ngFor="#author of authors" (click)="onRemove(author)">
      <img src="{{author.picture}}">
      <a *ngIf="!author.email && !author.homepage">{{author.name}}</a>
      <a *ngIf="author.email" href="mailto:{{author.email}}">{{author.name}}</a>
      <a *ngIf="author.homepage && !author.email" href="{{author.homepage}}" target="_blank">{{author.name}}</a>
      <i class="material-icons">close</i>
    </div>
 `
})
export class AuthorChipEditComponent {

  @Input() authors:any;
  @Output() authorRemovedEvent:EventEmitter<String> = new EventEmitter();
  @Output() authorSelectedEvent:EventEmitter<String> = new EventEmitter();


  onRemove(author:any) {
    this.authorRemovedEvent.emit(author);
  }

  onAuthorSelectedEvent(author:any) {
    this.authorSelectedEvent.emit(author);
  }

}
