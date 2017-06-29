import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
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
            let fixture = TestBed.createComponent(PreviewControlConstructComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with construct',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PreviewControlConstructComponent);
            fixture.componentInstance.construct = {'controlConstructKind': 'SEQUENCE_CONSTRUCT'};
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any = fixture.debugElement.queryAll(By.css('qddt-preview-sequence'));
              expect(de.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

@Component({
  selector: 'qddt-preview-condition',
  template: `<div></div>`
})

class PreviewConditionComponent {
  @Input() condition: any;
}

@Component({
  selector: 'qddt-preview-statement',
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
  selector: 'qddt-preview-sequence',
  template: `<div></div>`
})

class SequencePreviewComponent {
  @Input() sequence: any;
}
