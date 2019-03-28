import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewConditionConstructComponent } from './preview.condition.component';
import {ConditionConstruct} from '../../classes';

export function main() {
  describe('Condition preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewConditionConstructComponent],
        providers: [
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewConditionConstructComponent);
            fixture.detectChanges();
            expect(fixture.componentInstance.condition.conditionKind).toBe('');
          });
      }));

    it('should work with condition',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewConditionConstructComponent);
            fixture.componentInstance.condition = new ConditionConstruct( { 'name': 'test'});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any = fixture.debugElement.queryAll(By.css('textarea'));
              expect(de.length).toBeGreaterThan(0);
              expect(de[0].nativeElement.value).toBe('test');
            });
          });
      }));
  });
}
