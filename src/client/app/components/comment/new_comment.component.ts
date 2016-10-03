import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommentService, Comment } from './comment.service';

@Component({
  selector: 'new-comment',
  moduleId: module.id,
  template: `
          <form (ngSubmit)="save()" #hf="ngForm">
            <div class="row">
              <div class="input-field col s8 m8 l8">
                <label for="comment">Write a new comment</label>
                <textarea class="materialize-textarea" [(ngModel)]="comment.comment" required></textarea>
              </div>
            </div>
            <button type="submit" class="btn">Submit</button>
          </form>
  `,
  providers: [CommentService]
})
export class NewCommentComponent {

  @Output() addedCommentEvent: EventEmitter<Comment>  = new EventEmitter<Comment>();
  comment: Comment = new Comment();
  @Input() private ownerId: string;

  constructor(private commentService: CommentService) {
    this.commentService = commentService;
  }

  save() {
    this.comment.ownerId = this.ownerId;
    this.commentService.save(this.comment).subscribe((result: any) => {
      this.comment = new Comment();
      this.addedCommentEvent.emit(result);
    });
  }

}
