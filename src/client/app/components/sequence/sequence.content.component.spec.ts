import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { SequenceService } from './sequence.service';
import { UserService } from '../../common/user.service';
import { BaseService } from '../../common/base.service';
import { SequenceContentComponent } from './sequence.content.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Sequence content component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SequenceContentComponent,
          SequencePreviewComponent, CommentListComponent,
          ConditionPreviewComponent, StatementPreviewComponent,
          ControlConstructPreviewComponent, ConstructPreviewComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: SequenceService, useClass: SequenceServiceSpy },
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
            let fixture = TestBed.createComponent(SequenceContentComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('ul'));
            expect(de.length).toBe(1);
          });
      }));

    it('should work with preview',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(SequenceContentComponent);
            let element:any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one condition',
                'controlConstructKind': 'CONDITION_CONSTRUCT',
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added'
                };
            fixture.componentInstance.onSelectedElement(element);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any[] = fixture.debugElement.queryAll(By.css('.modal-content'));
              expect(de.length).toBe(1);
              let preview: any[] = fixture.debugElement.queryAll(By.css('qddt-condition-preview'));
              expect(preview.length).toBe(1);
            });
          });
      }));
  });
}

//override dependencies
class SequenceServiceSpy {
  getElements = jasmine.createSpy('getElements').and.callFake(function (key) {
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
  selector: 'qddt-sequence-detail',
  template: `<div></div>`
})

class SequenceDetailComponent {
  @Input() sequence: any;
  @Input() sequences: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
}

@Component({
  selector: 'qddt-sequence-preview',
  template: `<div></div>`
})

class SequencePreviewComponent {
  @Input() sequence: any;
}

@Component({
  selector: 'qddt-condition-preview',
  template: `<div></div>`
})

class ConditionPreviewComponent {
  @Input() condition: any;
}

@Component({
  selector: 'qddt-construct-preview',
  template: `<div></div>`
})

class ConstructPreviewComponent {
  @Input() construct: any;
}

@Component({
  selector: 'qddt-control-construct-preview',
  template: `<div></div>`
})

class ControlConstructPreviewComponent {
  @Input() controlConstruct: any;
}

@Component({
  selector: 'qddt-statement-preview',
  template: `<div></div>`
})

class StatementPreviewComponent {
  @Input() statement: any;
}
