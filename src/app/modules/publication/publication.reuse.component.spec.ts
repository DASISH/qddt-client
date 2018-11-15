import { Component, Input,  EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PublicationService } from './publication.service';
import { PublicationReuseComponent } from './publication.reuse.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Publication reuse component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ PublicationReuseComponent, ResponsedomainPreviewComponent,
        QddtAutoCompleteComponent, PublicationSelectComponent ],
        providers: [
          { provide: PublicationService, useClass: PublicationServiceSpy },
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
            const fixture = TestBed.createComponent(PublicationReuseComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('i'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should work with reuse',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PublicationReuseComponent);
/*             const mockBackend = TestBed.get(MockBackend);
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
 */            fixture.componentInstance.onItemSearch( { element: 'test', elementKind: ''});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.itemList.length).toBe(1);
            });
          });
      }));
  });
}

// override dependencies
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
  @Output() publicationElement = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-auto-complete',
  template: `<div></div>`
})

class QddtAutoCompleteComponent {
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
