import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { MaterializeModule } from 'angular2-materialize';
import { ControlConstructService } from '../controlconstruct.service';
import { SequenceDetailComponent } from './sequenceconstruct.detail.component';
import { SequenceReuseComponent } from './sequenceconstruct.reuse.component';
import { SequenceContentComponent } from './sequenceconstruct.content.component';

export function main() {
  describe('Sequence detail component', () => { //
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ // no more boilerplate code w/ custom providers needed :-)
          HttpClientModule,
          HttpClientTestingModule,
          CommonModule, FormsModule, MaterializeModule,
          SequenceReuseComponent, SequenceDetailComponent, SequenceContentComponent
        ],
      });
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SequenceDetailComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('form'));
            expect(de.length).toBe(0);
          });
      }));

    it(`should issue a request`, // 1. declare as async test since the HttpClient works with Observables
    async(  // 2. inject HttpClient and HttpTestingController into the test
        inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => { // 3. send a simple request
          http.get('/foo/bar').subscribe();
          // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
          // here two, it's significantly less boilerplate code needed to verify an expected request
          backend.expectOne({
            url: '/foo/bar',
            method: 'GET'
          });
        })
      )
    );
  });
}
