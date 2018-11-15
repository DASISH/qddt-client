import { TestBed, async } from '@angular/core/testing';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewSequenceConstructComponent } from './preview.sequence.component';
import { PreviewConditionConstructComponent } from './preview.condition.component';
import { PreviewStatementConstructComponent } from './preview.statement.component';
import {PreviewControlConstructComponent} from './preview.controlconstruct.component';
import {SequenceConstruct} from '../../classes';

export function main() {
  describe('Sequence preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewSequenceConstructComponent, PreviewConditionConstructComponent,
          PreviewStatementConstructComponent, PreviewControlConstructComponent],
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
            const fixture = TestBed.createComponent(PreviewSequenceConstructComponent);
            fixture.detectChanges();
            expect(fixture.componentInstance.sequenceConstruct).toBe(null);
          });
      }));

    it('should work with sequence',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewSequenceConstructComponent);
            fixture.componentInstance.sequenceConstruct = new SequenceConstruct( {'description': 'test'});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.sequenceConstruct.description).toBe('test');
            });
          });
      }));
  });
}

