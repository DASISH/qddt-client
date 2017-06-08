import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { PublicationService } from './publication.service';
import { UserService } from '../../common/user.service';
import { PublicationComponent } from './publication.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Publication component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PublicationComponent, RevisionComponent,
          PublicationReuseComponent, PublicationDetailComponent,
          PublicationPreviewComponent, CommentListComponent,
          AuthorChipComponent, TableComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: PublicationService, useClass: PublicationServiceSpy },
          { provide: UserService, useClass: UserServiceSpy },
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
            let fixture = TestBed.createComponent(PublicationComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('form'));
            expect(de.length).toBe(0);
            fixture.componentInstance.onTogglePublicationForm();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any = fixture.debugElement.queryAll(By.css('form'));
              expect(de.length).toBeGreaterThan(0);
            });
          });
      }));

    it('should work with searching',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PublicationComponent);
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"content":[{'
                + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                + '"name" : "one publication",'
                + '"basedOnObject" : null,'
                + '"basedOnRevision" : null,'
                + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
                + '"changeKind" : "CONCEPTUAL",'
                + '"changeComment" : "Information added"'
                + '}],'
                + '"page" : { "size" : 20, "totalElements" : 1, "totalPages" : 1, "number" : 0}}'
              })));
            });
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.publications.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.publications[0].name).toContain('publication');
            });
          });
      }));
  });
}

//override dependencies
class PublicationServiceSpy {
  searchPublications = jasmine.createSpy('searchPublications').and.callFake(function (key) {
    return [];
  });
}

class UserServiceSpy {
  getGlobalObject = jasmine.createSpy('getGlobalObject').and.callFake(function (key) {
    return {};
  });

  setGlobalObject = jasmine.createSpy('setGlobalObject').and.callFake(function (key) {
    return {};
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
  selector: 'qddt-publication-preview',
  template: `<div></div>`
})

class PublicationPreviewComponent {
  @Input() element: any;
  @Input() elementType: any;
}

@Component({
  selector: 'qddt-publication-reuse',
  template: `<div></div>`
})

class PublicationReuseComponent {
  @Output() publicationElement: any = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-publication-detail',
  template: `<div></div>`
})

class PublicationDetailComponent {
  @Input() publication: any;
  @Input() publicationId: string;
  @Input() publications: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
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
