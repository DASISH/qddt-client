import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { QuestionService } from './question.service';
import { BaseService } from '../../common/base.service';
import { QuestionItemEditComponent } from './question.edit.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Question edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ RevisionDetailComponent, StudyUsedbyComponent,
          TopicUsedbyComponent, QuestionitemUsedbyComponent,
          QuestionItemEditComponent, CommentListComponent,
          QuestionItemEditMissingComponent, TreeNodeComponent,
          ResponsedomainReuseComponent, RationalComponent,
          ResponsedomainPreviewComponent],
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
            let fixture = TestBed.createComponent(QuestionItemEditComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with question',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(QuestionItemEditComponent);
            let questionitem: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'questionitem',
              'label' : 'questionitem',
              'question': {'question': 'questionitem'},
              'basedOnObject' : null,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.questionitem = questionitem;
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let elements: any = fixture.debugElement.queryAll(By.css('textarea'));
              expect(elements.length).toBeGreaterThan(0);
              expect(elements[0].nativeElement.value).toContain('questionitem');
            });
          });
      }));
  });
}

//override dependencies
class QuestionServiceSpy {
  updateQuestionItem = jasmine.createSpy('updateQuestionItem').and.callFake(function (key) {
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
  @Output() editMissing: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-revision-detail',
  template: `<div></div>`
})

class RevisionDetailComponent {
  @Input() element: any;
  @Input() type: string;
  @Output() BasedonObjectDetail: any = new EventEmitter<string>();
}

@Component({
  selector: 'qddt-rational',
  template: `<div></div>`
})

class RationalComponent {
  @Input() element: any;
  @Input() config: any;
}

@Component({
  selector: 'qddt-study-preview',
  template: `<div></div>`
})

class StudyUsedbyComponent {
  @Input() id: string;
}

@Component({
  selector: 'qddt-topic-preview',
  template: `<div></div>`
})

class TopicUsedbyComponent {
  @Input() id: string;
}

@Component({
  selector: 'qddt-questionitem-preview',
  template: `<div></div>`
})

class QuestionitemUsedbyComponent {
  @Input() id: string;
}

@Component({
  selector: 'qddt-questionitem-treenode',
  template: `<div></div>`
})

class TreeNodeComponent {
  @Output() deleteConceptEvent: EventEmitter<any> = new EventEmitter();
  @Input() concept: any;
}

@Component({
  selector: 'qddt-responsedomain-reuse',
  template: `<div></div>`
})

class ResponsedomainReuseComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
  @Output() responseDomainReuse: EventEmitter<any> = new EventEmitter();
}

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}
