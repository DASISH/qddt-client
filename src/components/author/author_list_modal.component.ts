import {Component, Output,EventEmitter} from 'angular2/core';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {AuthorService} from './author.service';

@Component({
  selector: 'author-list-modal',
  moduleId: module.id,
  directives: [MaterializeDirective],
  providers: [AuthorService],
  template: `
  <div class="chip" >
  <a materialize="leanModal" [materializeParams]="[{dismissible: false}]"
   class=" modal-trigger" href="#author-modal">...
  </a>
  
  <div style="z-index: 1003; display: none; opacity: 0; transform: scaleX(0.7); top: 232.449px;" id="author-modal" class="modal">
    <div class="modal-content">
      <h4>Modal Header</h4>
      <ul class="collection">
        <li class="collection-item avatar" *ngFor="#author of authors" (click)="onSelect(author)">
          <img src="{{author.picture}}" alt="" class="circle">
          <span class="title">{{author.name}}</span>
          <p><a href="{{author.homepage}}">{{author.about}}</a></p>
          {{author.authorsAffiliation}}
        </li>
      </ul>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-action modal-close waves-effect waves-red btn-flat ">Close</a>
    </div>
  </div>
  </div>
`
})
export class AuthorListModalComponent {

  @Output() authorSelectedEvent:EventEmitter<String> = new EventEmitter();
  private  authors: any[];


  constructor(private authorService: AuthorService) {

  }

  onSelect(value:any ) {
    var i = this.authors.findIndex(F=>F===value);
    this.authors.splice(i,1);
    this.authorSelectedEvent.emit(value);
  }


  ngOnInit() {
    console.log('ngOnInit');
    this.authorService.getAll()
      .subscribe(result => {
        this.authors = result.content;
      });
  }
}

