import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { ControlConstructService } from './controlconstruct.service';
import { ControlConstructComponent } from './controlconstruct.component';
import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { AuthService } from '../auth/auth.service';

export function main() {
  describe('Controlconstruct component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ControlConstructComponent, RevisionComponent, CommentListComponent,
          ControlConstructDetailComponent, ControlConstructQuestionItemSelectComponent,
          AutocompleteComponent, TableComponent, QuestionitemDetailComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: ControlConstructService, useClass: ControlConstructServiceSpy },
          { provide: AuthService, useClass: UserServiceSpy },
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
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(ControlConstructComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('h4'));
            expect(de.length).toBeGreaterThan(0);
            expect(de[0].nativeNode.textContent).toContain('Question constructs');
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any = fixture.debugElement.queryAll(By.css('a'));
              expect(de.length).toBeGreaterThan(0);
            });
          });
      }));

    it('should work with controlConstructs',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(ControlConstructComponent);
            let questionitem: any = {
              'id': '1',
              'name': 'questionitem'
            };
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"content": [{'
                + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                + '"name" : "one controlConstruct",'
                + '"basedOnObject" : null,'
                + '"basedOnRevision" : null,'
                + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
                + '"changeKind" : "CONCEPTUAL",'
                + '"changeComment" : "Information added"'
                + '}]}'
              })));
            });
            fixture.componentInstance.searchControlConstructs('test');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let table: any = fixture.debugElement.queryAll(By.css('qddt-table'));
              expect(table.length).toBeGreaterThan(0);
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

class ControlConstructServiceSpy {
  searchQuestionItemsByNameAndQuestion = jasmine.createSpy('searchQuestionItemsByNameAndQuestion').and.callFake(function (key) {
    return [];
  });

  getControlConstructsByQuestionItem = jasmine.createSpy('getControlConstructsByQuestionItem').and.callFake(function (key) {
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
  selector: 'autocomplete',
  template: `<div></div>`
})

export class AutocompleteComponent {
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
  selector: 'qddt-control-construct-questionitem-select',
  template: `<div></div>`
})

class ControlConstructQuestionItemSelectComponent {
  @Input() controlConstruct;
  @Output() useQuestionItemEvent = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-controle-construct-detail',
  template: `<div></div>`
})

class ControlConstructDetailComponent {
  @Input() controlConstruct: any;
  @Input() controlConstructId: string;
  @Input() controlConstructs: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() exceptionEvent: EventEmitter<String> = new EventEmitter<String>();
}

@Component({
  selector: 'qddt-questionitem-detail',
  template: `<div></div>`
})

class QuestionitemDetailComponent {
  @Input() questionitem: any;
  @Input() questionitemId: string;
  @Input() questionitems: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
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
