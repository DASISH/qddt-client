import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResponsedomainScaleComponent } from './scale.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Responsedomain scale component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsedomainScaleComponent],
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
            const fixture = TestBed.createComponent(ResponsedomainScaleComponent);
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
            const fixture = TestBed.createComponent(ResponsedomainScaleComponent);
            const managedRepresentation: any = {
              'id': '0c3c168e-d1ea-421f-a629-7487c71fbf1a',
              'name': 'Code',
              'changeKind': 'CREATED',
              'label': 'scheme for code',
              'description': '[SCALE] group - ',
              'inputLimit': {
                'minimum': '1',
                'maximum': '5'
              },
              'classificationLevel': 'Ordinal',
              'hierarchyLevel': 'GROUP_ENTITY',
              'categoryType': 'SCALE',
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
                  'codeValue': '5'
                },
              }]
            };
            fixture.componentInstance.managedRepresentation = managedRepresentation;
            fixture.componentInstance.ngOnChanges();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const trs: any[] = fixture.debugElement.queryAll(By.css('tr'));
              expect(trs.length).toBeGreaterThan(0);
              expect(trs[0].nativeNode.textContent).toContain('start');
            });
          });
      }));
  });
}
