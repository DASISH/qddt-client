import {Component, Inject, Input, OnInit} from 'angular2/angular2';
import {CommentService, Comment} from './commentservice';
import {NewCommentComponent} from '../comment/new_comment';

@Component({
  selector: 'comment-list',
  template: `
    <div *ng-if="commentsPage">
      <a class="btn btn-flat btn-medium waves-effect waves-light teal white-text" (click)="toggleComments()">
      <i class="material-icons left">message</i>{{commentsPage.page.totalElements}} </a>
    </div>
  <div *ng-if="showComments">
    <div *ng-if="commentsPage" class="card">
        <ul>
            <li class="collection-item avatar" *ng-for="#comment of commentsPage.content">
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
    <new-comment (added-comment-event)="addedComment($event)" [owner-id]="ownerId"></new-comment>
    </div>

  `,
  directives: [CommentListComponent, NewCommentComponent],
  providers: [CommentService],
  bindings: [CommentService]
})
export class CommentListComponent implements OnInit {

  showComments: boolean = false;
  commentsPage:any;
  comment: Comment = new Comment();
  commentService: CommentService;
  @Input('owner-id') ownerId: string;

  constructor(@Inject(CommentService)commentService: CommentService) {
    this.commentService = commentService;
  }

  onInit() {
    this.commentService.getAll(this.ownerId).subscribe(result => this.commentsPage = result);
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addedComment() {
    this.commentService.getAll(this.ownerId).subscribe(result => this.commentsPage = result);
  }


}
