import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResponsedomainNumericComponent } from './numeric.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Responsedomain numeric component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsedomainNumericComponent],
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
            let fixture = TestBed.createComponent(ResponsedomainNumericComponent);
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
            let fixture = TestBed.createComponent(ResponsedomainNumericComponent);
            let managedRepresentation: any = {
              'id': '0c3c168e-d1ea-421f-a629-7487c71fbf1a',
              'name': 'Code',
              'changeKind': 'CREATED',
              'label': 'scheme for code',
              'description': '[NUMERIC]',
              'inputLimit': {
                'minimum': '1',
                'maximum': '2'
              },
              'classificationLevel': 'Ordinal',
              'hierarchyLevel': 'ENTITY',
              'categoryType': 'NUMERIC',
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
              'categoryType' : 'NUMERIC',
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
              let labels: any[] = fixture.debugElement.queryAll(By.css('label'));
              expect(labels.length).toBeGreaterThan(0);
              expect(labels[0].nativeNode.textContent).toContain('Range from 1 to 2');
            });
          });
      }));
  });
}
