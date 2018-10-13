import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewControlConstructComponent } from './preview.controlconstruct.component';

export function main() {
  describe('Construct preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewControlConstructComponent,
        SequencePreviewComponent, PreviewConditionComponent,
        StatementPreviewComponent, PreviewQuestionConstructComponent],
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
            const fixture = TestBed.createComponent(PreviewControlConstructComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with construct',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewControlConstructComponent);
            fixture.componentInstance.construct = {  id: '', name: '', description: '', otherMaterials: [],
              postInstructions: [], preInstructions: [], questionItem: null, classKind: 'SEQUENCE_CONSTRUCT',
            universe: [], questionItemRevision: 0};
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any = fixture.debugElement.queryAll(By.css('qddt-preview-sequenceconstruct'));
              expect(de.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

@Component({
  selector: 'qddt-preview-conditionconstruct',
  template: `<div></div>`
})

class PreviewConditionComponent {
  @Input() condition: any;
}

@Component({
  selector: 'qddt-preview-statementconstruct',
  template: `<div></div>`
})

class StatementPreviewComponent {
  @Input() statement: any;
}
@Component({
  selector: 'qddt-preview-questionconstruct',
  template: `<div></div>`
})

class PreviewQuestionConstructComponent {
  @Input() controlConstruct: any;
}

@Component({
  selector: 'qddt-preview-sequenceconstruct',
  template: `<div></div>`
})

class SequencePreviewComponent {
  @Input() sequence: any;
}
