import {Component, Inject, Input} from 'angular2/core';
import {CommentService, Comment} from './commentservice';
import {NewCommentComponent} from '../comment/new_comment';
import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'comment-list',
   pipes: [LocalDatePipe],
  template: `
    <div *ngIf="commentsPage">
      <a class="btn btn-flat btn-medium waves-effect waves-light teal white-text" (click)="toggleComments()">
      <i class="material-icons left">message</i>{{commentsPage.page.totalElements}} </a>
    </div>
  <div *ngIf="showComments">
    <div *ngIf="commentsPage" class="card">
        <ul>
            <li class="collection-item avatar" *ngFor="#comment of commentsPage.content">
                <img src="images/avatar-default.png" WIDTH=50 style="float:left;" alt="" class="circle">
                <span class="title">{{comment.createdBy.username}}@{{comment.createdBy.agency.name}} </span>
                  <p>
                     {{comment.comment}}
                  </p>
                <i class="secondary-content material-icons right ">comment</i>
                <comment-list [ownerId]="comment.id"></comment-list>
              </li>
            </ul>
        </div>
    <new-comment (addedCommentEvent)="addedComment($event)" [ownerId]="ownerId"></new-comment>
    </div>

  `,
  directives: [CommentListComponent, NewCommentComponent],
  providers: [CommentService]
})
export class CommentListComponent {

  showComments: boolean = false;
  commentsPage:any;
  comment: Comment = new Comment();
  commentService: CommentService;
  @Input() ownerId: string;

  constructor(@Inject(CommentService)commentService: CommentService) {
    this.commentService = commentService;
  }

  ngOnInit() {
    this.commentService.getAll(this.ownerId).subscribe(result => this.commentsPage = result);
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addedComment() {
    this.commentService.getAll(this.ownerId).subscribe(result => this.commentsPage = result);
  }


}
