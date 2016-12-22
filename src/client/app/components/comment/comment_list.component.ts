import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from './comment.service';

@Component({
  selector: 'comment-list',
  moduleId: module.id,
  template: `
    <div *ngIf="commentsPage">
      <a class="btn btn-flat btn-medium waves-effect waves-light teal white-text" (click)="toggleComments()">
      <i class="material-icons left">message</i>{{commentsPage.page.totalElements}} </a>
    </div>
    <div *ngIf="showComments">
      <div *ngIf="commentsPage" class="card">
        <ul class="collection">
          <li class="collection-item avatar"
            *ngFor="let comment of commentsPage.content; let idx=index;">
            <img src="assets/images/avatar-default.png"  alt ="" class="circle">
            <span class="title">
              {{comment.modifiedBy.username}}@{{comment.modifiedBy.agency.name}}
              - {{comment.modified|localDate }}
            </span>
            <div class="row" *ngIf="!isEditComment || selectedCommentId !== idx">
              <br>
              <div class="col s10">
                {{comment.comment}}
              </div>
              <div class="col s2 right">
                <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                  (click)="isEditComment=true;message=comment.comment;selectedCommentId=idx;">
                  <i class="material-icons left small">edit</i>
                </a>
              </div>
            </div>
            <div class="row" *ngIf="isEditComment && selectedCommentId === idx">
              <br>
              <div class="col s10">
                <textarea class="materialize-textarea"
                  [(ngModel)]="message">
                </textarea>
              </div>
              <div class="col s2 right">
                <a class="btn-flat btn-floating btn-small waves-effect waves-light teal"
                  (click)="onUpdateComment(idx)">
                  <i class="material-icons left small">done_all</i>
                </a>
                <a class="btn-flat btn-floating btn-small waves-effect waves-light teal"
                  (click)="isEditComment=false">
                  <i class="material-icons left small">cancel</i>
                </a>
              </div>
            </div>
            <i class="secondary-content material-icons right ">comment</i>
            <comment-list [ownerId]="comment.id"></comment-list>
          </li>
        </ul>
      </div>
      <new-comment (addedCommentEvent)="addedComment($event)" [ownerId]="ownerId"></new-comment>
    </div>

  `,
  providers: [CommentService]
})

export class CommentListComponent implements OnInit {
  isEditComment: boolean = false;
  selectedCommentId: number;
  message: string = '';
  showComments: boolean = false;
  commentsPage:any;
  @Input() ownerId: string;

  constructor(private commentService: CommentService) {
    this.selectedCommentId = 0;
  }

  ngOnInit() {
    this.commentService.getAll(this.ownerId).subscribe((result: any) => this.commentsPage = result);
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addedComment() {
    this.commentService.getAll(this.ownerId).subscribe((result: any) => this.commentsPage = result,
      (error: any) => console.log(error));
  }

  onUpdateComment(idx: number) {
    this.isEditComment = false;
    if(this.commentsPage.content.length > idx) {
      let comment = this.commentsPage.content[idx];
      if(this.message !== comment.comment) {
        comment.comment = this.message;
        this.commentService.updateComment(comment).subscribe((result: any) => {
          this.commentsPage.content[idx] = result;
        }, (error: any) => console.log(error));
      }
    }
  }

}
