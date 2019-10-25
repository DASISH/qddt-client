import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CommentService } from './comment.service';
import { IComment } from '../../lib';

@Component({
  selector: 'qddt-comment-list',
  styles: [`img { border-radius: 50%; width: 48px; float: right; position: relative; top: 8px; }`],
  templateUrl: `./comment.list.component.html`,
  providers: [CommentService]
})

export class CommentListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() ownerId: string;
  @Input() comments: IComment[] = [];
  @Input() showPrivate = true;

  isEditComment = false;
  isPublic = true;
  selectedCommentId: number;
  message = '';
  private _showComments = false;
  private _hasShown = false;
  constructor(private commentService: CommentService) {
    this.selectedCommentId = 0;
  }

  private isRetrieved() { return (this._hasShown || (this.comments && this.comments.length > 0) ); }

  get showComments(): boolean {
    return this._showComments;
  }

  set showComments(value: boolean) {
    this._showComments = value;
    if (!this.isRetrieved()) {
      this.commentService.getAll(this.ownerId).then(
        (result) =>  {
          this._hasShown = true;
          this.comments = result.content;
        });
    }
  }

  get size(): string {
    return (!this.isRetrieved()) ? '?' :
      this.comments.map( c => c.size + 1).reduce((previousValue, currentValue) => {
      return (previousValue + (isNaN(currentValue) ? 1 : currentValue));
        }, 0).toString();
  }

  ngOnInit() {  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes.valueOf() || JSON);
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
      input => M.CharacterCounter.init(input));

  }

  addComment(comment: IComment ) {
    comment.ownerIdx = this.comments.length;
    this.commentService.update(comment).subscribe(
      result => this.comments.push(result) );
  }

  onDeleteComment(idx) {
    if (idx) {
      const comment = this.comments[idx];
      this.commentService.delete(comment.id).subscribe(
        () => this.comments.splice(idx, 1));
    }
  }

  onUpdateComment(idx: number) {
    this.isEditComment = false;
    if (this.comments.length > idx) {
      const comment = this.comments[idx];
      if (this.message !== comment.comment || this.isPublic !== comment.public) {
        comment.comment = this.message;
        comment.public = this.isPublic;
        comment.ownerIdx = idx;
        this.commentService.update(comment).subscribe(
          (result) => this.comments.splice(idx, 1, result),
          (err) => {
            this.commentService.getAll(this.ownerId).then((result) => this.comments = result.content);
            throw err;
          });
      }
    }
  }

  commentAsElement(comment: IComment, idx: number) {
    return { id: idx, name: comment.comment.slice(1, 20) };
  }

}
