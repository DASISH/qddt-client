import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResponsedomainMixedComponent } from './mixed.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Responsedomain mixed component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsedomainDatetimeComponent,
        ResponsedomainScaleComponent, ResponsedomainTextComponent,
        ResponsedomainMixedComponent, ResponsedomainMissingComponent,
        ResponsedomainNumericComponent, ResponsedomainCodeListComponent],
        providers: [
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
      //Mock debounceTime
      // Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ResponsedomainMixedComponent);
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
            const fixture = TestBed.createComponent(ResponsedomainMixedComponent);
            const managedRepresentation: any = {
              'id': '0c3c168e-d1ea-421f-a629-7487c71fbf1a',
              'name': 'Code',
              'changeKind': 'CREATED',
              'label': 'scheme for code',
              'description': '[List] group - ',
              'inputLimit': {
                'minimum': '0',
                'maximum': '1'
              },
              'classificationLevel': 'Ordinal',
              'hierarchyLevel': 'GROUP_ENTITY',
              'categoryType': 'MIXED',
              'code': {
                'codeValue': ''
              },
              'children': [{
                'id': '103f75be-800d-4afb-aed3-298ba1b458bc',
                'name': 'start',
                'label': 'start',
                'hierarchyLevel': 'ENTITY',
                'categoryType': 'LIST',
                'code': {
                  'codeValue': '1'
                },
              }, {
                'id': '97478484-4c31-460d-a654-0672673b4b8f',
                'name': 'end',
                'changeKind': 'CREATED',
                'label': 'end',
                'hierarchyLevel': 'ENTITY',
                'categoryType': 'MISSING_GROUP',
                'children' : [ ],
                'code': {
                  'codeValue': ''
                },
              }]
            };

            fixture.componentInstance.managedRepresentation = managedRepresentation;
            fixture.componentInstance.ngOnChanges();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.managedRepresentation.children.length).toBe(2);
              expect(fixture.componentInstance.managedRepresentation.categoryType).toContain('LIST');
            });
          });
      }));
  });
}

@Component({
  selector: 'qddt-responsedomain-scale',
  template: `<div></div>`
})

class ResponsedomainScaleComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-responsedomain-numeric',
  template: `<div></div>`
})

class ResponsedomainNumericComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-responsedomain-datetime',
  template: `<div></div>`
})

class ResponsedomainDatetimeComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-responsedomain-codelist',
  template: `<div></div>`
})

class ResponsedomainCodeListComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-responsedomain-text',
  template: `<div></div>`
})

class ResponsedomainTextComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-responsedomain-missing',
  template: `<div></div>`
})

class ResponsedomainMissingComponent {
  @Input() responseDomain;
}
