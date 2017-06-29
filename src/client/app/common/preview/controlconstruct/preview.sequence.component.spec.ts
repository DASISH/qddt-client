import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { API_BASE_HREF } from '../../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewSequenceConstructComponent } from './preview.sequence.component';
import { PreviewConditionConstructComponent } from './preview.condition.component';
import { PreviewStatementConstructComponent } from './preview.statement.component';
import { PreviewControlConstructComponent } from '../preview.controlconstruct.component';

export function main() {
  describe('Sequence preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewSequenceConstructComponent, PreviewConditionConstructComponent,
          PreviewStatementConstructComponent, PreviewControlConstructComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          },
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
            let fixture = TestBed.createComponent(PreviewSequenceConstructComponent);
            fixture.detectChanges();
            expect(fixture.componentInstance.text).toBe('');
          });
      }));

    it('should work with sequence',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PreviewSequenceConstructComponent);
            fixture.componentInstance.sequence = {'description': 'test'};
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.text).toBe('test');
            });
          });
      }));
  });
}

// @Component({
//   selector: 'qddt-preview-conditionconstruct',
//   template: `<div></div>`
// })
//
//
// @Component({
//   selector: 'qddt-preview-statementconstruct',
//   template: `<div></div>`
// })
//
// // class StatementPreviewComponent {
// //   @Input() statement: any;
// // }
// @Component({
//   selector: 'qddt-preview-questionconstruct',
//   template: `<div></div>`
// })

// class ControlConstructPreviewComponent {
//   @Input() controlConstruct: any;
// }
