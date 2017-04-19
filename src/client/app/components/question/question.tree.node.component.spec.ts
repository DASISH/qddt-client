import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { QuestionService } from './question.service';
import { BaseService } from '../../common/base.service';
import { TreeNodeComponent } from './question.tree.node.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Question tree node component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ TreeNodeComponent, RevisionComponent,
          QuestionitemReuseComponent, ConceptEditReuseComponent,
          AuthorChipComponent, LocalDatePipe,
          QuestionItemEditComponent, CommentListComponent ],
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
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TreeNodeComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with concept',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TreeNodeComponent);
            let concept: any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one concept',
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'questionItems': [],
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added'
                };
            fixture.componentInstance.concept = concept;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let h5: any = fixture.debugElement.queryAll(By.css('h5'));
              expect(h5.length).toBeGreaterThan(0);
              expect(h5[0].nativeNode.textContent).toContain('concept');
            });
          });
      }));
  });
}

//override dependencies
class QuestionServiceSpy {
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
  selector: 'qddt-questionitem-reuse',
  template: `<div></div>`
})

class QuestionitemReuseComponent {
  @Input() parentId: any;
}


@Component({
  selector: 'qddt-concept-edit',
  template: `<div></div>`
})

class ConceptEditReuseComponent {
  @Input() concept: any;
  @Input() isVisible: boolean;
  @Output() questionItemCreatedEvent: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-author-chip',
  template: `<div></div>`
})

class AuthorChipComponent {
  @Input() authors: any;
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
