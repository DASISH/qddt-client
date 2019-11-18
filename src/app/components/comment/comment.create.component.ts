import {Component, Input, Output, EventEmitter } from '@angular/core';
import { IComment } from '../../lib';

@Component({
  selector: 'qddt-comment-create',

  template: `
  <form class="row" id="{{formId}}" (ngSubmit)="onSave()" >
    <div class="input-field col s10">
      <textarea class="materialize-textarea" name="{{ownerId}}-comment" data-length="10000"  [(ngModel)]="comment.comment" required></textarea>
      <label>Write a new comment</label>
    </div>
    <div class="input-field col s2">
      <div class="switch right">
        <label>
          <input id="{{ownerId}}-checked" type="checkbox" [checked]="comment.public" (change)="comment.public = !comment.public">
          <span class="lever"></span>Published
        </label>
      </div>
    </div>
    <button type="submit" class="btn col s3 right">Submit</button>
  </form>
  `,
  providers: []
})
export class CommentCreateComponent  {

  @Output() updatedEvent  = new EventEmitter<IComment>();
  @Input() ownerId: string;

  public readonly formId = Math.round( Math.random() * 10000);
  comment = this.newComment();

  onSave() {
    this.updatedEvent.emit( {size: 0, comment: this.comment.comment, public: this.comment.public , ownerId: this.ownerId } );
    this.comment = this.newComment();
  }

  private newComment(): IComment {
    return {size: 0, comment: '', public: true , ownerId: this.ownerId };
  }
  // ngAfterContentChecked(): void {
  //   document.querySelectorAll('textarea').forEach(
  //     input => M.textareaAutoResize(input));
  // }

  // ngAfterViewInit(): void {
  //   document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
  //     input => M.CharacterCounter.init(input));
  // }
}
