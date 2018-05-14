import { Component, Input,  EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResponsedomainReuseComponent } from './responsedomain.reuse.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MaterializeModule } from 'angular2-materialize';
import { API_BASE_HREF } from '../../api';
import { TemplateService } from '../../template/template.service';

export function main() {
  describe('Responsedomain reuse component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsedomainReuseComponent, QddtAutoCompleteComponent,
        RevisionComponent, ResponsedomainFormComponent,
        ResponseDomainSelectComponent],
        providers: [
          { provide: TemplateService, useClass: ResponseDomainServiceSpy },
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
            const fixture = TestBed.createComponent(ResponsedomainReuseComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('ul'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with responseDomain',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ResponsedomainReuseComponent);
            const managedRepresentation: any = {
              'id': '0c3c168e-d1ea-421f-a629-7487c71fbf1a',
              'name': 'Code',
              'changeKind': 'CREATED',
              'label': 'scheme for code',
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
            const responseDomain: any = {
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
            fixture.componentInstance.ngOnChanges();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const types: any[] = fixture.debugElement.queryAll(By.css('input'));
              expect(types.length).toBeGreaterThan(1);
              expect(types[1].nativeNode.value).toBeTruthy();
            });
          });
      }));
  });
}

// override dependencies
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

@Component({
  selector: 'qddt-responsedomain-form',
  template: `<div></div>`
})

class ResponsedomainFormComponent {
  @Input() responsedomain: any;
  @Input() domainType: any;
  @Input() readonly: boolean;
  @Output() formChange =  new EventEmitter<any>();
}

@Component({
  selector: 'qddt-responsedomain-edit-missing',
  template: `<div></div>`
})

class ResponseDomainSelectComponent {
  @Input() responseDomain;
  @Input() revision;
  @Output() useResponseDomainEvent = new EventEmitter<any>();
}
