import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from './comment.service';

@Component({
  selector: 'qddt-comment-list',
  moduleId: module.id,
  template: `
    <div *ngIf="comments">
      <a class="btn btn-flat btn-medium waves-effect waves-light teal white-text" (click)="toggleComments()">
      <i class="material-icons left">message</i>{{comments.length}} </a>
    </div>
    <div *ngIf="showComments">
      <div *ngIf="comments" class="card">
        <ul class="collection">
          <li class="collection-item avatar"
            *ngFor="let comment of comments; let idx=index;">
            <img src="assets/images/avatar-default.png"  alt ="" class="circle">
            <span class="title">
              {{comment?.modifiedBy?.username}}@{{comment?.modifiedBy?.agency?.name}}
              - {{comment?.modified|localDate }}
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
                <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                  (click)="onDeleteComment(idx)">
                  <i class="material-icons left medium" title="Delete" >delete_forever</i>
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
            <qddt-comment-list *ngIf="showComments"
              [ownerId]="comment.id" [comments]="comment.comments">
            </qddt-comment-list>
          </li>
        </ul>
      </div>
      <qddt-comment-create (addedCommentEvent)="addedComment($event)" [ownerId]="ownerId"></qddt-comment-create>
    </div>
  `,
  providers: [CommentService]
})

export class CommentListComponent implements OnInit {
  isEditComment: boolean = false;
  selectedCommentId: number;
  message: string = '';
  showComments: boolean = false;
  @Input() ownerId: string;
  @Input() comments: any[];

  constructor(private commentService: CommentService) {
    this.selectedCommentId = 0;
  }

  ngOnInit() {
    if(this.comments === null || this.comments === undefined) {
      this.comments = [];
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addedComment() {
    this.commentService.getAll(this.ownerId).subscribe((result: any) => this.comments = result.content,
      (error: any) => console.log(error));
  }

  onDeleteComment(idx: number) {
    let comment = this.comments[idx];
    comment.isHidden = true;
    this.commentService.updateComment(comment).subscribe((result: any) => {
      this.comments.splice(idx, 1);
    }, (error: any) => console.log(error));
  }

  onUpdateComment(idx: number) {
    this.isEditComment = false;
    if(this.comments.length > idx) {
      let comment = this.comments[idx];
      if(this.message !== comment.comment) {
        comment.comment = this.message;
        this.commentService.updateComment(comment).subscribe((result: any) => {
          this.comments[idx] = result;
        }, (error: any) => console.log(error));
      }
    }
  }

}
