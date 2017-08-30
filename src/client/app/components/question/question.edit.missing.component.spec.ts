import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { QuestionService } from './question.service';
import { BaseService } from '../../common/base.service';
import { QuestionItemEditMissingComponent } from './question.edit.missing.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Question edit missing component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          QuestionItemEditMissingComponent, AutocompleteComponent,
        ],
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
            let fixture = TestBed.createComponent(QuestionItemEditMissingComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with missing',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(QuestionItemEditMissingComponent);
            let missing: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'missing',
              'label' : 'questionitem',
              'question': {'question': 'questionitem'},
              'basedOnObject' : null,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.missing = missing;
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let elements: any = fixture.debugElement.queryAll(By.css('span'));
              expect(elements.length).toBeGreaterThan(1);
              expect(elements[1].nativeElement.textContent).toContain('missing');
            });
          });
      }));
  });
}

//override dependencies
class QuestionServiceSpy {
  getAllTemplatesByCategoryKind = jasmine.createSpy('getAllTemplatesByCategoryKind').and.callFake(function (key) {
    return [];
  });
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
