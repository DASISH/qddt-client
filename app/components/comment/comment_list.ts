import {Component, NgFor, CORE_DIRECTIVES, Inject, Input} from 'angular2/angular2';

import {CommentService, Comment} from './commentservice';

@Component({
  selector: 'comment-list',
  template: `
        <ul *ng-for="#comment of comments">
          <li class="collection-item avatar">
            <img src="images/avatar-default.png" alt="" class="circle">
            <span class="title">{{comment.createdBy}}</span>
            <p>
               {{comment.comment}}
            </p>
            <i class="secondary-content material-icons right">comment</i>
          </li>
        </ul>
  `,
  directives: [CORE_DIRECTIVES, NgFor],
  providers: [CommentService],
  properties: ['comments']
})
export class CommentListComponent {

  commentService: CommentService;
  comments: Array<Comment> = [];

  @Input('owner-id') ownerId: string;

  constructor(@Inject(CommentService)commentService: CommentService) {
    this.commentService = commentService;
    //this.comments = this.commentService.getAll(this.ownerId);
    console.log('ID...', this.ownerId);
    this.comments = this.dummycomments();
    console.log(this.comments);
  }


  dummycomments(): Array<Comment> {
    var cmnts: Array<Comment> = [];

    for(var i = 0; i < 3; i++) {
      var cmnt = new Comment();
      cmnt.id = 'f324f-'+i*2500+'-4321-'+i*40+(i/20);
      cmnt.createdBy = "admin";
      cmnt.ownerId = "this";
      cmnt.comment = 'I am a comment for this ' + cmnt.id;
      cmnts.push(cmnt);
    }

    return cmnts;
  }
}
