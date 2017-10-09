import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewQuestionConstructComponent } from './preview.question.component';
import { PreviewResponsedomainComponent } from '../preview.responsedomain.component';

export function main() {
  describe('Control Construct preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewQuestionConstructComponent, PreviewResponsedomainComponent],
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
            let fixture = TestBed.createComponent(PreviewQuestionConstructComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with controlConstruct',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PreviewQuestionConstructComponent);
            fixture.componentInstance.controlConstruct = {'name': 'test'};
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any = fixture.debugElement.queryAll(By.css('textarea'));
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

