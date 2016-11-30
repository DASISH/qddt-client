import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthorService } from './author.service';

@Component({
  selector: 'author-list-modal',
  moduleId: module.id,
  providers: [ AuthorService ],
  template: `
  <div class="chip" >
  <a materialize="leanModal" [materializeParams]="[{dismissible: false}]"
   class=" modal-trigger" href="#author-modal">...
  </a>
  
  <div style="z-index: 1003; display: none; opacity: 0; transform: scaleX(0.7); top: 232.449px;" id="author-modal" class="modal">
    <div class="modal-content">
      <h4>Modal Header</h4>
      <ul class="collection">
        <li class="collection-item avatar" *ngFor="let author of authors" (click)="onSelect(author)">
          <img src="{{author.picture}}" alt="" class="circle">
          <span class="title">{{author.name}}</span>
          <p><a href="{{author.homepage}}">{{author.about}}</a></p>
          {{author.authorsAffiliation}}
        </li>
      </ul>
    </div>
    <div class="modal-footer">
      <a class="modal-action modal-close waves-effect waves-red btn-flat ">Close</a>
    </div>
  </div>
  </div>
`
})
export class AuthorListModalComponent implements OnInit {

  @Output() authorSelectedEvent:EventEmitter<String> = new EventEmitter<String>();
  private  authors: any[];

  constructor(private authorService: AuthorService) {
  }

  onSelect(value:any ) {
    var i = this.authors.findIndex(F=>F===value);
    this.authors.splice(i,1);
    this.authorSelectedEvent.emit(value);
  }

  ngOnInit() {
    this.authorService.getAll()
      .subscribe( (result: any) => {
        this.authors = result.content;
      });
  }
}
