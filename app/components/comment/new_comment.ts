import {Component, FORM_DIRECTIVES, CORE_DIRECTIVES, Inject, Input, Output, EventEmitter} from 'angular2/angular2';

import {CommentService, Comment} from './commentservice';

@Component({
  selector: 'new-comment',
  template: `
          <form (ng-submit)="save()" #hf="form">
            <div class="row">
              <div class="input-field col">
                <input id="comment" type="text" [(ng-model)]="comment.comment" required>
                <label for="comment">Write a new comment</label>
              </div>
            </div>
            <button type="submit" class="btn">Submit</button>
          </form>
  `,
  providers: [CommentService]
})
export class NewCommentComponent {

  @Output() addedCommentEvent: EventEmitter  = new EventEmitter();
  @Input('owner-id') private ownerId: string;
  private comment: Comment;
  private commentService: CommentService;

  constructor(@Inject(CommentService)commentService: CommentService) {
    this.commentService = commentService;
    this.comment = new Comment();
  }

  save() {
    this.comment.ownerId = this.ownerId;
    this.commentService.save(this.comment);
    this.addedCommentEvent.next('event');
  }
}
