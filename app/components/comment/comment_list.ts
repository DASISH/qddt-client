import {Component, NgFor, CORE_DIRECTIVES, Inject, Input} from 'angular2/angular2';

import {CommentService, Comment} from './commentservice';
import {NewCommentComponent} from '../comment/new_comment';

@Component({
  selector: 'comment-list',
  template: `
      <div *ng-if="commentsPage" class="card">
        <ul *ng-for="#content of commentsPage">
          <li class="collection-item avatar" *ng-for="#comment of content.content">
            <img src="images/avatar-default.png" alt="" class="circle">
            <span class="title">{{comment.createdBy.username}}</span>
              <p>
                 id: {{comment.id}} <br />
                 comment: {{comment.comment}}<br />
                 ownerid: {{comment.ownerId}}
              </p>
            <i class="secondary-content material-icons right ">comment</i>
            <comment-list [owner-id]="comment.id"></comment-list>
          </li>
        </ul>
      </div>
      <new-comment (added-comment-event)="addedComment($comment)" [owner-id]="ownerId"></new-comment>
  `,
  directives: [CORE_DIRECTIVES, NgFor, CommentListComponent, NewCommentComponent],
  providers: [CommentService],
  properties: ['comments']
})
export class CommentListComponent {

  commentService: CommentService;
  commentsPage: any;
  @Input('owner-id') ownerId: string;

  constructor(@Inject(CommentService)commentService: CommentService) {
    this.commentService = commentService;
  }

  onInit() {
    this.commentsPage = this.commentService.getAll(this.ownerId);
  }

  addedComment(comment: any) {
    console.log('[CommentListComponent].EVENT(added comment)' , comment);
    this.commentsPage = [];
    this.commentsPage = this.commentService.getAll(this.ownerId);
  }
}
