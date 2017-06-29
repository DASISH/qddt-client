import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewConditionConstructComponent } from './preview.condition.component';

export function main() {
  describe('Condition preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewConditionConstructComponent],
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
            let fixture = TestBed.createComponent(PreviewConditionConstructComponent);
            fixture.detectChanges();
            expect(fixture.componentInstance.conditionjson.elseConditions.length).toBe(0);
          });
      }));

    it('should work with condition',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PreviewConditionConstructComponent);
            fixture.componentInstance.condition = {'name': 'test'};
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
