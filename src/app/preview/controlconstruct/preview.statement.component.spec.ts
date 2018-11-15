import { TestBed, async } from '@angular/core/testing';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewStatementConstructComponent } from './preview.statement.component';
import {StatementConstruct} from '../../classes';

export function main() {
  describe('Statement preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewStatementConstructComponent],
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
            const fixture = TestBed.createComponent(PreviewStatementConstructComponent);
            fixture.detectChanges();
            expect(fixture.componentInstance.text).toBe('');
          });
      }));

    it('should work with statement',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewStatementConstructComponent);
            fixture.componentInstance.statement = new StatementConstruct( {'statement': 'test'} );
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.text).toBe('test');
            });
          });
      }));
  });
}
