import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResponsedomainDatetimeComponent } from './datetime.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export function main() {
  describe('Responsedomain datetime component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsedomainDatetimeComponent],
        providers: [
        ],
        imports: [CommonModule, FormsModule]
      });
      // Mock debounceTime
      // Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ResponsedomainDatetimeComponent);
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
            const fixture = TestBed.createComponent(ResponsedomainDatetimeComponent);
            const managedRepresentation: any = {
              'id': '0c3c168e-d1ea-421f-a629-7487c71fbf1a',
              'name': 'Code',
              'changeKind': 'CREATED',
              'label': 'scheme for code',
              'description': '[DATETIME] group - ',
              'inputLimit': {
                'minimum': '1',
                'maximum': '2'
              },
              'classificationLevel': 'Ordinal',
              'hierarchyLevel': 'GROUP_ENTITY',
              'categoryType': 'DATETIME',
              'code': {
                'codeValue': ''
              },
              'children': []
            };

            fixture.componentInstance.managedRepresentation = managedRepresentation;
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const label: any[] = fixture.debugElement.queryAll(By.css('label'));
              expect(label.length).toBeGreaterThan(0);
              expect(label[0].nativeNode.textContent).toContain('1');
            });
          });
      }));
  });
}
