import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentService, Comment } from './comment.service';

@Component({
  selector: 'qddt-comment-create',
  moduleId: module.id,
  template: `
    <form (ngSubmit)="save()" #hf="ngForm">
      <div class="row">
        <div class="input-field col l8">
          <label [attr.for]="ownerId + '-comment'">Write a new comment</label>
          <textarea class="materialize-textarea"
            id="{{ownerId}}-comment"
            name="{{ownerId}}-comment"
            [(ngModel)]="comment.comment" required></textarea>
        </div>
        <div class="input-field col l4">
          <div class="switch">
            <label>
              Private
              <input id="{{ownerId}}-checked" type="checkbox" [checked]="comment.public" (change)="comment.public = !comment.public">
              <span class="lever"></span>
              Public
            </label>
          </div>
        </div>
      </div>
      <button type="submit" class="btn">Submit</button>
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
    this.commentService.createComment(this.comment).subscribe((result: any) => {
      this.comment = new Comment();
      this.addedCommentEvent.emit(result);
    });
  }

}
