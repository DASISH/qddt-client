import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {CommentService, Comment} from './commentservice';

@Component({
  selector: 'new-comment',
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

  @Output() addedCommentEvent: EventEmitter<Comment>  = new EventEmitter();
  @Input() private ownerId: string;
  private comment: Comment = new Comment();

  constructor(private commentService: CommentService) {
    this.commentService = commentService;
  }

  save() {
    this.comment.ownerId = this.ownerId;
    this.commentService.save(this.comment).subscribe(result => {
      this.comment = new Comment();
      this.addedCommentEvent.emit(result);
    });
  }

}
