import {Component, NgFor, CORE_DIRECTIVES, Inject, Input} from 'angular2/angular2';

import {CommentService, Comment} from './commentservice';
import {NewCommentComponent} from '../comment/new_comment';

@Component({
  selector: 'comment-list',
  template: `
        <ul *ng-for="#content of commentsPage">
          <li class="collection-item avatar" *ng-for="#comment of content.content">
            <img src="images/avatar-default.png" alt="" class="circle">
            <span class="title">{{comment.createdBy.username}}</span>
              <p>
                 {{comment.comment}}
              </p>
            <i class="secondary-content material-icons right ">comment</i>
          </li>
        </ul>
  `,
  directives: [CORE_DIRECTIVES, NgFor],
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
}
