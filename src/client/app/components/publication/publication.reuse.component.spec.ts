import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { PublicationService } from './publication.service';
import { UserService } from '../../shared/user/user.service';
import { BaseService } from '../../shared/base.service';
import { PublicationReuseComponent } from './publication.reuse.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Publication reuse component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ PublicationReuseComponent, ResponsedomainPreviewComponent,
        AutocompleteComponent, PublicationSelectComponent ],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: PublicationService, useClass: PublicationServiceSpy },
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
            let fixture = TestBed.createComponent(PublicationReuseComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('i'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should work with reuse',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PublicationReuseComponent);
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
            fixture.componentInstance.onSearchElements('test');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.elements.length).toBe(1);
            });
          });
      }));
  });
}

//override dependencies
class PublicationServiceSpy {
  getElements = jasmine.createSpy('getElements').and.callFake(function (key) {
    return [];
  });
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
  selector: 'qddt-publication-select',
  template: `<div></div>`
})

class PublicationSelectComponent {
  @Input() element: any;
  @Input() elementType: any;
  @Output() publicationElement: any = new EventEmitter<any>();
}

@Component({
  selector: 'autocomplete',
  template: `<div></div>`
})

class AutocompleteComponent {
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
