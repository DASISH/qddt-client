import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MaterializeModule } from 'angular2-materialize';
import { QuestionFormComponent } from './question.form.component';
import { TemplateService } from '../../lib/services/template.service';

export function main() {
  describe('Question edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ RevisionDetailComponent, StudyUsedbyComponent,
          TopicUsedbyComponent, QuestionitemUsedbyComponent,
          QuestionFormComponent, CommentListComponent,
          QuestionItemEditMissingComponent, TreeNodeComponent,
          ResponsedomainReuseComponent, RationalComponent,
          ResponsedomainPreviewComponent],
        providers: [
          { provide: TemplateService, useClass: QuestionServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
      // Mock debounceTime
      // Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(QuestionFormComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with question',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(QuestionFormComponent);
            const questionitem: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'questionitem',
              'label' : 'questionitem',
              'question': 'questionitem',
              'basedOnObject' : null,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.questionItem = questionitem;
            // fixture.componentInstance.ngOnChanges({'noe'});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const elements: any = fixture.debugElement.queryAll(By.css('textarea'));
              expect(elements.length).toBeGreaterThan(0);
              expect(elements[0].nativeElement.value).toContain('questionitem');
            });
          });
      }));
  });
}

// override dependencies
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
  @Output() editMissing =  new EventEmitter<any>();
}

@Component({
  selector: 'qddt-element-footer',
  template: `<div></div>`
})

class RevisionDetailComponent {
  @Input() element: any;
  @Input() type: string;
  @Output() BasedonObjectDetail = new EventEmitter<string>();
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
  @Output() deleteEvent =  new EventEmitter();
  @Input() concept: any;
}

@Component({
  selector: 'qddt-responsedomain-reuse',
  template: `<div></div>`
})

class ResponsedomainReuseComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
  @Output() responseDomainReuse =  new EventEmitter();
}

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}
