import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResponsedomainDatetimeComponent } from './datetime.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Responsedomain datetime component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsedomainDatetimeComponent],
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
            let fixture = TestBed.createComponent(ResponsedomainDatetimeComponent);
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
            let fixture = TestBed.createComponent(ResponsedomainDatetimeComponent);
            let managedRepresentation: any = {
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
            let responseDomain: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'responseDomain',
              'basedOnObject' : null,
              'categoryType' : 'DATETIME',
              'managedRepresentation' : managedRepresentation,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.responseDomain = responseDomain;
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let label: any[] = fixture.debugElement.queryAll(By.css('label'));
              expect(label.length).toBeGreaterThan(0);
              expect(label[0].nativeNode.textContent).toContain('1');
            });
          });
      }));
  });
}
