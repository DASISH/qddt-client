import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { QuestionService } from './question.service';
import { UserService } from '../../common/user.service';
import { BaseService } from '../../common/base.service';
import { QuestionComponent } from './question.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Question component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [QuestionComponent, RevisionComponent, LocalDatePipe,
          TableComponent, QuestionItemEditComponent, CommentListComponent,
          QuestionDetailComponent, AuthorChipComponent,
          QuestionItemEditMissingComponent, ResponsedomainPreviewComponent,
          ResponsedomainReuseComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: QuestionService, useClass: QuestionServiceSpy },
          { provide: UserService, useClass: UserServiceSpy },
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
      //Mock debounceTime
      Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(QuestionComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with questions',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(QuestionComponent);
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"content":[{'
                + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                + '"name" : "question",'
                + '"basedOnObject" : null,'
                + '"basedOnRevision" : null,'
                + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
                + '"changeKind" : "CONCEPTUAL",'
                + '"changeComment" : "Information added"'
                + '}],'
                + '"page" : { "size" : 20, "totalElements" : 1, "totalPages" : 1, "number" : 0}}'
              })));
            });
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let table: any = fixture.debugElement.queryAll(By.css('qddt-table'));
              expect(table.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.questionitems.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.questionitems[0].name).toContain('question');
            });
          });
      }));
  });
}

//override dependencies
class UserServiceSpy {
  getGlobalObject = jasmine.createSpy('getGlobalObject').and.callFake(function (key) {
    return {};
  });

  setGlobalObject = jasmine.createSpy('setGlobalObject').and.callFake(function (key) {
    return {};
  });
}

class QuestionServiceSpy {
  searchQuestionItemsByNameAndQuestion = jasmine.createSpy('searchQuestionItemsByNameAndQuestion').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-comment-list',
  template: `<div></div>`
})

class CommentListComponent {
  @Input() ownerId: any;
  @Input() comments: any[];
}

@Component({
  selector: 'qddt-questionitem-edit-missing',
  template: `<div></div>`
})

class QuestionItemEditMissingComponent {
  @Input() missing: any;
  @Input() readonly: boolean;
  @Input() mainResponseDomain: any;
  @Output() editMissing: EventEmitter<any>;
}

@Component({
  selector: 'qddt-questionitem-edit',
  template: `<div></div>`
})

class QuestionItemEditComponent {
  @Input() isVisible: boolean;
  @Input() questionitem: any;
  @Input() readonly: boolean;
  @Input() editResponseDomain: boolean;
  @Output() editQuestionItem: EventEmitter<any>;
}

@Component({
  selector: 'qddt-questionitem-detail',
  template: `<div></div>`
})

class QuestionDetailComponent {
  @Input() questionitem: any;
  @Input() questionitemId: string;
  @Input() questionitems: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() editQuestionItem: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-table',
  template: `<div></div>`
})

class TableComponent {
  @Input() page: any;
  @Input() columns: any[];
  @Input() items: any[];
  @Input() placeholder: string;

  @Input() searchFromServer: boolean;
  @Output() detailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() pageChangeEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();
}


@Component({
  selector: 'qddt-revision',
  template: `<div></div>`
})

class RevisionComponent {
  @Input() isVisible: any;
  @Input() config: any;
  @Input() qddtURI: any;
  @Input() current: any;
}

@Component({
  selector: 'qddt-author-chip',
  template: `<div></div>`
})

class AuthorChipComponent {
  @Input() authors: any;
}

@Component({
  selector: 'qddt-responsedomain-preview',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}

@Component({
  selector: 'responsedomain-reuse',
  template: `<div></div>`
})

class ResponsedomainReuseComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
  @Output() responseDomainReuse: EventEmitter<any> = new EventEmitter();
}

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  transform(input: Array<number>): string {
    return '';
  }
}
