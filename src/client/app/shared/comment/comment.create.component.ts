import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentService, Comment } from './comment.service';

@Component({
  selector: 'qddt-comment-create',
  moduleId: module.id,
  template: `
    <form class="card" (ngSubmit)="save()" #hf="ngForm">
      <div class="row">
        <div class="input-field col l9 m7 s12">
          <label [attr.for]="ownerId + '-comment'">Write a new comment</label>
          <textarea class="materialize-textarea"
            id="{{ownerId}}-comment"
            name="{{ownerId}}-comment"
            length="2000"
            [(ngModel)]="comment.comment" required></textarea>
        </div>
        <div class="input-field col l3 m5 s7">
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
  providers: [CommentService]
})
export class CommentCreateComponent {

  @Output() addedCommentEvent: EventEmitter<Comment>  = new EventEmitter<Comment>();
  @Input() ownerId: string;
  comment: Comment = new Comment();

  constructor(private commentService: CommentService) {
    this.commentService = commentService;
  }

  save() {
    this.comment.ownerId = this.ownerId;
    this.comment = new Comment();
    this.commentService.createComment(this.comment)
      .subscribe((result: any) => {
      this.addedCommentEvent.emit(result);
    }
    , (err:any) => {
          this.addedCommentEvent.emit(null);
      throw err;
    });
  }

}
