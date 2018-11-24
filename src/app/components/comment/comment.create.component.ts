import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IComment } from '../../classes';

@Component({
  selector: 'qddt-comment-create',

  template: `
    <form class="card" (ngSubmit)="save()" #hf="ngForm">
      <div class="row">
        <div class="input-field col l9 m7 s12">
          <textarea class="materialize-textarea" name="{{ownerId}}-comment" length="2000" [(ngModel)]="comment.comment" required></textarea>
          <label>Write a new comment</label>
        </div>
        <div class="col l3 m5 s7">
          <div class="switch">
            <label>
              <input id="{{ownerId}}-checked" type="checkbox" [checked]="comment.public" (change)="comment.public = !comment.public">
              <span class="lever"></span>Published
            </label>
          </div>
        </div>
      </div>
      <div class="row">
        <button type="submit" class="btn col s3 offset-s9 ">Submit</button>
      </div>
    </form>
  `,
  providers: []
})
export class CommentCreateComponent {

  @Output() updatedEvent  = new EventEmitter<IComment>();
  @Input() ownerId: string;
  comment = this.newComment();

  save() {
    this.updatedEvent.emit( { comment: this.comment.comment, public: this.comment.public , ownerId: this.ownerId } );
    this.comment = this.newComment();
  }

  private newComment(): IComment {
    return { comment: '', public: true , ownerId: this.ownerId };
  }

}
