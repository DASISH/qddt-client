import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { ConceptService } from './concept.service';
import { ConceptComponent } from './concept.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Concept component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConceptComponent, RevisionComponent,
          ConceptTocComponent, TreeNodeComponent,
          ConceptEditComponent, CommentListComponent, AuthorChipComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: ConceptService, useClass: ConceptServiceSpy },
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
            let fixture = TestBed.createComponent(ConceptComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBe(0);
            fixture.componentInstance.show = true;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any = fixture.debugElement.queryAll(By.css('a'));
              expect(de.length).toBeGreaterThan(0);
            });
          });
      }));

    it('should work with topic',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(ConceptComponent);
            fixture.componentInstance.topic = {
              'id': '1',
              'name': 'topic'
            };
            fixture.componentInstance.show = true;
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"content":[{'
                + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                + '"name" : "one concept",'
                + '"basedOnObject" : null,'
                + '"basedOnRevision" : null,'
                + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
                + '"changeKind" : "CONCEPTUAL",'
                + '"changeComment" : "Information added"'
                + '}],'
                + '"page" : { "size" : 20, "totalElements" : 1, "totalPages" : 1, "number" : 0}}'
              })));
            });
            fixture.componentInstance.ngOnChanges();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let treenodes: any = fixture.debugElement.queryAll(By.css('qddt-concept-treenode'));
              expect(treenodes.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

//override dependencies
class ConceptServiceSpy {
  getByTopic = jasmine.createSpy('getByTopic').and.callFake(function (key) {
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
  selector: 'concept-edit',
  template: `<div></div>`
})

class ConceptEditComponent {
  @Input() concept: any;
  @Input() isVisible: boolean;
}

@Component({
  selector: 'qddt-concept-toc',
  template: `<div></div>`
})

class ConceptTocComponent {
  @Input() concepts: any;
  @Input() level: number;
}

@Component({
  selector: 'qddt-concept-treenode',
  template: `<div></div>`
})

class TreeNodeComponent {
  @Input() concept: any;
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
