import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { ResponseDomainService } from './responsedomain.service';
import { UserService } from '../../common/user.service';
import { BaseService } from '../../common/base.service';
import { ResponsedomainReuseComponent } from './responsedomain.reuse.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';
import { API_BASE_HREF } from '../../api';

export function main() {
  describe('Responsedomain reuse component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsedomainReuseComponent, AutocompleteComponent,
        RevisionComponent, ResponsedomainFormComponent,
        ResponseDomainSelectComponent],
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
            let fixture = TestBed.createComponent(ResponsedomainReuseComponent);
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
            let fixture = TestBed.createComponent(ResponsedomainReuseComponent);
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
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.ngOnChanges();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let types: any[] = fixture.debugElement.queryAll(By.css('input'));
              expect(types.length).toBeGreaterThan(1);
              expect(types[1].nativeNode.value).toBeTruthy();
            });
          });
      }));
  });
}

//override dependencies
class ResponseDomainServiceSpy {
  getAll = jasmine.createSpy('getAll').and.callFake(function (key) {
    return [];
  });
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
  selector: 'autocomplete',
  template: `<div></div>`
})

class AutocompleteComponent {
  @Input() items:  any[];
  @Input() searchField: any;
  @Input() placeholder: string;
  @Input() isMutipleFields: boolean;
  @Input() initialValue: string;
  @Input() searchFromServer: boolean;
  @Output() autocompleteSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() autocompleteFocusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-responsedomain-form',
  template: `<div></div>`
})

class ResponsedomainFormComponent {
  @Input() responsedomain: any;
  @Input() domainType: any;
  @Input() readonly: boolean;
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'qddt-responsedomain-select',
  template: `<div></div>`
})

class ResponseDomainSelectComponent {
  @Input() responseDomain;
  @Input() revision;
  @Output() useResponseDomainEvent = new EventEmitter<any>();
}