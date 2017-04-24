import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { ResponseDomainService } from './responsedomain.service';
import { UserService } from '../../common/user.service';
import { BaseService } from '../../common/base.service';
import { ResponseDomainSelectComponent } from './responsedomain.select.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';
import { API_BASE_HREF } from '../../api';

export function main() {
  describe('Responsedomain select component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponseDomainSelectComponent, ResponsedomainPreviewComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: ResponseDomainService, useClass: ResponseDomainServiceSpy },
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
      //Mock debounceTime
      Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(ResponseDomainSelectComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('ul'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with responseDomain',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(ResponseDomainSelectComponent);
            let managedRepresentation: any = {
              'id': '0c3c168e-d1ea-421f-a629-7487c71fbf1a',
              'name': 'Code',
              'changeKind': 'CREATED',
              'label': 'category scheme for code',
              'description': '[List] group - ',
              'inputLimit': {
                'minimum': '1',
                'maximum': '2'
              },
              'classificationLevel': 'Ordinal',
              'hierarchyLevel': 'GROUP_ENTITY',
              'categoryType': 'LIST',
              'code': {
                'codeValue': ''
              },
              'children': [{
                'id': '103f75be-800d-4afb-aed3-298ba1b458bc',
                'name': 'start',
                'label': 'start',
                'hierarchyLevel': 'ENTITY',
                'categoryType': 'CATEGORY',
                'code': {
                  'codeValue': '1'
                },
              }, {
                'id': '97478484-4c31-460d-a654-0672673b4b8f',
                'name': 'end',
                'changeKind': 'CREATED',
                'label': 'end',
                'hierarchyLevel': 'ENTITY',
                'categoryType': 'CATEGORY',
                'code': {
                  'codeValue': '2'
                },
              }]
            };
            let responseDomain: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'responseDomain',
              'basedOnObject' : null,
              'categoryType' : 'LIST',
              'managedRepresentation' : managedRepresentation,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.responseDomain = responseDomain;
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"content":['
                + '{"entity": '
                + JSON.stringify(responseDomain)
                + ', "revisionNumber": 11}'
                + '],'
                + '"page" : { "size" : 20, "totalElements" : 1, "totalPages" : 1, "number" : 0}}'
              })));
            });
            fixture.componentInstance.ngOnChanges();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let options: any[] = fixture.debugElement.queryAll(By.css('option'));
              expect(options.length).toBeGreaterThan(0);
              expect(options[0].nativeNode.value).toContain('11');
            });
          });
      }));
  });
}

//override dependencies
class ResponseDomainServiceSpy {
  getResponseDomainsRevisions = jasmine.createSpy('getResponseDomainsRevisions').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-responsedomain-preview',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}
