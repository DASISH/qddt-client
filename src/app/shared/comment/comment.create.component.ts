import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentService } from './comment.service';
import { IComment } from '../classes/interfaces';

@Component({
  selector: 'qddt-comment-create',
  moduleId: module.id,
  template: `
    <form class="card" (ngSubmit)="save()" #hf="ngForm">
      <div class="row">
        <div class="input-field col l9 m7 s12">
          <label [attr.for]="ownerId + '-comment'">Write a new comment</label>
          <textarea class="materialize-textarea"
            id="{{ownerId}}-comment"
            name="{{ownerId}}-comment"
            length="2000"
            [(ngModel)]="comment.comment" required></textarea>
        </div>
        <div class="col l3 m5 s7">
          <div class="switch">
            <label>
              <input id="{{ownerId}}-checked" type="checkbox" [checked]="comment.public" (change)="comment.public = !comment.public">
              <span class="lever"></span>Published
            </label>
          </div>
        </div>
      </div>
      <div class="row">
        <button type="submit" class="btn col s3 offset-s9 ">Submit</button>
      </div>
    </form>
  `,
  providers: [CommentService]
})
export class CommentCreateComponent {

  @Output() updatedEvent  = new EventEmitter<Comment>();
  @Input() ownerId: string;
  comment = this.newComment();

  constructor(private commentService: CommentService) {
    this.commentService = commentService;
  }

  save() {
    this.comment.ownerId = this.ownerId;
    this.commentService.create(this.comment).subscribe((result: any) => {
      this.updatedEvent.emit(result);
        this.comment = this.newComment();
      }
    , (error) => {
      this.comment = this.newComment();
      this.updatedEvent.emit(null);
      throw error;
    });
  }

  private newComment(): IComment {
    return { comment: '', public: true };
  }

}
