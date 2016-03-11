import {Component, Inject, Input} from 'angular2/core';
import {CommentService, Comment} from './comment.service';
import {NewCommentComponent} from '../comment/new_comment.component';
import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'comment-list',
  moduleId: module.id,
  pipes: [LocalDatePipe],
  template: `
    <div *ngIf="commentsPage">
      <a class="btn btn-flat btn-medium waves-effect waves-light teal white-text" (click)="toggleComments()">
      <i class="material-icons left">message</i>{{commentsPage.page.totalElements}} </a>
    </div>
  <div *ngIf="showComments">
    <div *ngIf="commentsPage" class="card">
        <ul class="collection">
            <li class="collection-item avatar" *ngFor="#comment of commentsPage.content">
                  <img src="images/avatar-default.png"  alt ="" class="circle">
                <span class="title">{{comment.modifiedBy.username}}@{{comment.modifiedBy.agency.name}}
                                    - {{comment.modified|localDate }} </span>
                <p><br>{{comment.comment}}</p>
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
