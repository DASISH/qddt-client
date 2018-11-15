import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewQuestionConstructComponent } from './preview.question.component';
import {PreviewResponsedomainComponent} from '../responsedomain/preview.responsedomain.component';
import {QuestionConstruct} from '../../classes';

export function main() {
  describe('Control Construct preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewQuestionConstructComponent, PreviewResponsedomainComponent],
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
            const fixture = TestBed.createComponent(PreviewQuestionConstructComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with controlConstruct',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewQuestionConstructComponent);
            fixture.componentInstance.controlConstruct =  new QuestionConstruct( {'name': 'test'});
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

// @Component({
//   selector: 'qddt-preview-responsedomain',
//   template: `<div></div>`
// })

