import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { QuestionService } from './question.service';
import { QuestionComponent } from './question.component';
import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';
import { UserService } from '../core/user/user.service';

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
          { provide: QuestionService, useClass: QuestionServiceSpy },
          { provide: UserService, useClass: UserServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
      // Mock debounceTime
      Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(QuestionComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with questions',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(QuestionComponent);
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const table: any = fixture.debugElement.queryAll(By.css('qddt-table'));
              expect(table.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.questionitems.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.questionitems[0].name).toContain('question');
            });
          });
      }));
  });
}

// override dependencies
class UserServiceSpy {
  get = jasmine.createSpy('get').and.callFake(function (key) {
    return {};
  });

  set = jasmine.createSpy('set').and.callFake(function (key) {
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
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
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

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  transform(input: Array<number>): string {
    return '';
  }
}
  @Pipe({
    name: 'localDateTime',
    pure: true
  })
  export class LocalDateTimePipe implements PipeTransform {

  transform(input: Array<number>): string {
    return '';
  }
}
