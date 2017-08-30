import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { QuestionService } from './question.service';
import { BaseService } from '../../common/base.service';
import { QuestionReuseComponent } from './question.reuse.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Question reuse component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ RevisionComponent, QuestionReuseComponent,
          ResponsedomainPreviewComponent,
          AutocompleteComponent, QuestionItemEditComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: QuestionService, useClass: QuestionServiceSpy },
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
            let fixture = TestBed.createComponent(QuestionReuseComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with search',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(QuestionReuseComponent);
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"content":[{'
                + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                + '"name" : "test",'
                + '"basedOnObject" : null,'
                + '"basedOnRevision" : null,'
                + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
                + '"changeKind" : "CONCEPTUAL",'
                + '"changeComment" : "Information added"'
                + '}],'
                + '"page" : { "size" : 20, "totalElements" : 1, "totalPages" : 1, "number" : 0}}'
              })));
            });
            fixture.componentInstance.parentId = '7f000101-54aa-131e-8154-aa27fc230000';
            fixture.componentInstance.searchQuestionItems('test');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.questionItems.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.questionItems[0].name).toContain('test');
            });
          });
      }));
  });
}

//override dependencies
class QuestionServiceSpy {
  searchQuestionItemsByNameAndQuestion = jasmine.createSpy('searchQuestionItemsByNameAndQuestion').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-questionitem-edit',
  template: `<div></div>`
})

class QuestionItemEditComponent {
  @Input() isVisible: boolean;
  @Input() readonly: boolean;
  @Input() questionitem: any;
  @Input() editResponseDomain: boolean;
  @Output() editQuestionItem: EventEmitter<any> = new EventEmitter<any>();
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
  selector: 'autocomplete',
  template: `<div></div>`
})

class AutocompleteComponent {
  @Input() items:  any[];
  @Input() searchField: any;
  @Input() placeholder: string;
  @Input() isMultipleFields: boolean;
  @Input() initialValue: string;
  @Input() searchFromServer: boolean;
  @Output() autocompleteSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() autocompleteFocusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}
