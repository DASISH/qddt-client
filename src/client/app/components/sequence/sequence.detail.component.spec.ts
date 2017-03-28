import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { SequenceService } from './sequence.service';
import { UserService } from '../../common/user.service';
import { BaseService } from '../../common/base.service';
import { SequenceDetailComponent } from './sequence.detail.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Sequence detail component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionComponent,
          SequenceReuseComponent, CommentListComponent,
          SequenceDetailComponent, RationalComponent,
          AuthorChipComponent, SequenceContentComponent],
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
            let fixture = TestBed.createComponent(SequenceDetailComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('form'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with update',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(SequenceDetailComponent);
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{'
                + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                + '"name" : "one sequence",'
                + '"basedOnObject" : null,'
                + '"basedOnRevision" : null,'
                + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
                + '"changeKind" : "CONCEPTUAL",'
                + '"changeComment" : "Information added"'
                + '}'
              })));
            });
            let sequence:any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one test',
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added'
              };
            fixture.componentInstance.sequence = sequence;
            fixture.componentInstance.sequences = [sequence];
            fixture.componentInstance.onUpdateSequence();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.sequences.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.sequences[0].name).toBe('one sequence');
            });
          });
      }));
  });
}

//override dependencies
class SequenceServiceSpy {
  update = jasmine.createSpy('update').and.callFake(function (key) {
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
  selector: 'qddt-sequence-reuse',
  template: `<div></div>`
})

class SequenceReuseComponent {
  @Output() element: any = new EventEmitter<any>();
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
  selector: 'qddt-rational',
  template: `<div></div>`
})

class RationalComponent {
  @Input() element: any;
}

@Component({
  selector: 'qddt-sequence-content',
  template: `<div></div>`
})

class SequenceContentComponent {
  @Input() sequence: any;
}
