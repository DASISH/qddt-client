import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { ControlConstructService } from '../controlconstruct.service';
import { API_BASE_HREF } from '../../api';
import { MaterializeModule } from 'angular2-materialize';
import { QuestionConstructQuestionSelectComponent } from './questionconstruct.questionitem.select.component';

export function main() {
  describe('Controlconstruct questionitem select component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionComponent,
          QuestionConstructQuestionSelectComponent,
          AutocompleteComponent, QuestionitemDetailComponent,
          ResponsedomainPreviewComponent ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(QuestionConstructQuestionSelectComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('ul'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with controlConstruct',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(QuestionConstructQuestionSelectComponent);
            const controlConstruct: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'one controlConstruct',
              'questionItem': {
                'id' : '7f000101-54aa-131e-8154-aa27fc230001',
                'name': 'one question item'
              },
              'basedOnObject' : null,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.controlConstruct = controlConstruct;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const ul: any = fixture.debugElement.queryAll(By.css('ul'));
              expect(ul.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

// override dependencies
class ControlConstructServiceSpy {
  searchQuestionItemsByNameAndQuestion = jasmine.createSpy('searchQuestionItemsByNameAndQuestion').and.callFake(function (key) {
    return [];
  });
  getQuestionItemsRevisions = jasmine.createSpy('getQuestionItemsRevisions').and.callFake(function (key) {
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
  selector: 'qddt-auto-complete',
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

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}
