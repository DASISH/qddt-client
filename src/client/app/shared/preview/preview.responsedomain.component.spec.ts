import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PreviewResponsedomainComponent } from './preview.responsedomain.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Responsedomain preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewResponsedomainComponent, ResponsedomainDatetimeComponent,
        ResponsedomainScaleComponent, ResponsedomainTextComponent,
        ResponsedomainMixedComponent, ResponsedomainMissingComponent,
        ResponsedomainNumericComponent, ResponsedomainCodeListComponent],
        providers: [
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
            let fixture = TestBed.createComponent(PreviewResponsedomainComponent);
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
            let fixture = TestBed.createComponent(PreviewResponsedomainComponent);
            let managedRepresentation: any = {
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
            let responseDomain: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'responseDomain',
              'basedOnObject' : null,
              'responseKind': 'LIST',
              'managedRepresentation' : managedRepresentation,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.responseDomain = responseDomain;
            // fixture.componentInstance.ngOnChanges();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let list: any[] = fixture.debugElement.queryAll(By.css('qddt-preview-rd-codelist'));
              expect(list.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

@Component({
  selector: 'qddt-preview-rd-scale',
  template: `<div></div>`
})

class ResponsedomainScaleComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-preview-rd-numeric',
  template: `<div></div>`
})

class ResponsedomainNumericComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-preview-rd-datetime',
  template: `<div></div>`
})

class ResponsedomainDatetimeComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-preview-rd-codelist',
  template: `<div></div>`
})

class ResponsedomainCodeListComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-preview-rd-text',
  template: `<div></div>`
})

class ResponsedomainTextComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-preview-rd-missing',
  template: `<div></div>`
})

class ResponsedomainMissingComponent {
  @Input() responseDomain;
}

@Component({
  selector: 'qddt-preview-rd-mixed',
  template: `<div></div>`
})

class ResponsedomainMixedComponent {
  @Input() responseDomain;
}
