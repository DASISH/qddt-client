import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { QuestionConstructFormComponent } from './questionconstruct.form.component';
import { ControlConstructService } from '../controlconstruct.service';

export function main() {
  describe('Controlconstruct form component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionComponent, ControlConstructQuestionItemSelectComponent,
          CommentListComponent, AuthorChipComponent, InstructionComponent,
          QddtAutoCompleteComponent, TableComponent, QuestionitemDetailComponent,
          ResponsedomainPreviewComponent, RevisionDetailComponent, RationalComponent,
          QuestionConstructFormComponent],
        providers: [
          { provide: ControlConstructService, useClass: ControlConstructServiceSpy },
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
            const fixture = TestBed.createComponent(QuestionConstructFormComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('form'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with controlConstruct',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(QuestionConstructFormComponent);
            const controlConstruct: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'one controlConstruct',
              'basedOnObject' : null,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.controlConstruct = controlConstruct;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const form: any = fixture.debugElement.queryAll(By.css('form'));
              expect(form.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

// override dependencies
class ControlConstructServiceSpy {
  getControlConstruct = jasmine.createSpy('getControlConstruct').and.callFake(function (key) {
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

// @Component({
//   selector: 'qddt-auto-complete',
//   template: `<div></div>`
// })

export class QddtAutoCompleteComponent {
  @Input() items:  any[];
  @Input() searchField: any;
  @Input() placeholder: string;
  @Input() isMultipleFields: boolean;
  @Input() initialValue: string;
  @Input() searchFromServer: boolean;
  @Output() selectEvent =  new EventEmitter<any>();
  @Output() focusEvent =  new EventEmitter<any>();
  @Output() enterEvent =  new EventEmitter<any>();
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
  @Output() detailEvent =  new EventEmitter<String>();
  @Output() pageChangeEvent =  new EventEmitter<String>();
  @Output() enterEvent =  new EventEmitter<any>();
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
  selector: 'qddt-questionitem-detail',
  template: `<div></div>`
})

class QuestionitemDetailComponent {
  @Input() questionitem: any;
  @Input() questionitemId: string;
  @Input() questionitems: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent =  new EventEmitter<String>();
  @Output() editQuestionItem =  new EventEmitter<any>();
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
  selector: 'qddt-instruction-create',
  template: `<div></div>`
})

class InstructionComponent {
  @Output() createInstructionEvent = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}

@Component({
  selector: 'qddt-author-chip',
  template: `<div></div>`
})

class AuthorChipComponent {
  @Input() authors: any;
}

@Component({
  selector: 'qddt-element-footer',
  template: `<div></div>`
})

class RevisionDetailComponent {
  @Input() element: any;
  @Input() type: string;
}

@Component({
  selector: 'qddt-rational',
  template: `<div></div>`
})

class RationalComponent {
  @Input() element: any;
  @Input() config: any;
}
