import { Component, EventEmitter, Output } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { AuthorChipComponent } from './author.chip.component';
import { By } from '@angular/platform-browser';

export function main() {
  describe('Author chip component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AuthorChipComponent],
        providers: [
        ],
        imports: []
      });
    });

    it('should work with empty authors',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(AuthorChipComponent);
            fixture.componentInstance.authors = [];
            fixture.detectChanges();
            let de = fixture.debugElement.queryAll(By.css('.chip'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with authors',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(AuthorChipComponent);
            fixture.componentInstance.authors = [{}];
            fixture.detectChanges();
            let de = fixture.debugElement.queryAll(By.css('.chip'));
            expect(de.length).toBe(1);
          });
      }));

    it('should work with real authors',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(AuthorChipComponent);
            fixture.componentInstance.authors = [{
              'email': 'test@qddt.no',
              'homepage': 'homepage',
              'name': 'test'
            }];
            fixture.detectChanges();
            let de = fixture.debugElement.queryAll(By.css('.chip'));
            expect(de.length).toBe(1);
          });
      }));
  });
}
