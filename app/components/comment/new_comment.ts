import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {CommentService, Comment} from './commentservice';

@Component({
  selector: 'new-comment',
  template: `
          <form (ngSubmit)="save()" #hf="ngForm">
            <div class="row">
              <div class="input-field col">
                <input id="comment" type="text" [(ngModel)]="comment.comment" required>
                <label for="comment">Write a new comment</label>
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
