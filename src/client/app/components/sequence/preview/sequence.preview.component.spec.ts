import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { SequencePreviewComponent } from './sequence.preview.component';
import { API_BASE_HREF } from '../../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Sequence preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SequencePreviewComponent, ConditionPreviewComponent,
        StatementPreviewComponent, ControlConstructPreviewComponent],
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
            let fixture = TestBed.createComponent(SequencePreviewComponent);
            fixture.detectChanges();
            expect(fixture.componentInstance.text).toBe('');
          });
      }));

    it('should work with sequence',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(SequencePreviewComponent);
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
  selector: 'qddt-condition-preview',
  template: `<div></div>`
})

class ConditionPreviewComponent {
  @Input() condition: any;
}

@Component({
  selector: 'qddt-statement-preview',
  template: `<div></div>`
})

class StatementPreviewComponent {
  @Input() statement: any;
}
@Component({
  selector: 'qddt-control-construct-preview',
  template: `<div></div>`
})

class ControlConstructPreviewComponent {
  @Input() controlConstruct: any;
}
