import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ConceptTocComponent } from './concept-toc.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {API_BASE_HREF} from '../../../api';

export function main() {
  describe('Concept toc component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ ConceptTocComponent ],
        providers: [
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule]
      });
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ConceptTocComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('ul'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with toc',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ConceptTocComponent);
            const concept: any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one concept',
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added'
            };
            fixture.componentInstance.children = [ concept ];
            fixture.componentInstance.level = 0;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const li: any = fixture.debugElement.queryAll(By.css('li'));
              expect(li.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}
