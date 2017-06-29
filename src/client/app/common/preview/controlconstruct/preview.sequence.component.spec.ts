import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { API_BASE_HREF } from '../../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewConditionComponent } from './preview.condition.component';
import { PreviewStatementComponent } from './preview.statement.component';
import { PreviewControlConstructComponent } from './preview.question.component';
import { PreviewSequenceComponent } from './preview.sequence.component';

export function main() {
  describe('Sequence preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [, PreviewConditionComponent,
          PreviewStatementComponent, PreviewControlConstructComponent],
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
            let fixture = TestBed.createComponent(PreviewSequenceComponent);
            fixture.detectChanges();
            expect(fixture.componentInstance.text).toBe('');
          });
      }));

    it('should work with sequence',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PreviewSequenceComponent);
            fixture.componentInstance.sequence = {'description': 'test'};
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.text).toBe('test');
            });
          });
      }));
  });
}

@Component({
  selector: 'qddt-preview-condition',
  template: `<div></div>`
})


@Component({
  selector: 'qddt-preview-statement',
  template: `<div></div>`
})

// class StatementPreviewComponent {
//   @Input() statement: any;
// }
@Component({
  selector: 'qddt-preview-questionconstruct',
  template: `<div></div>`
})

// class ControlConstructPreviewComponent {
//   @Input() controlConstruct: any;
// }
