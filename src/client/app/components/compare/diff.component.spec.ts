import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { DiffComponent } from './diff.component';
import { By } from '@angular/platform-browser';

export function main() {
  describe('autocomplete component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ TestComponent, DiffComponent ],
        providers: [
        ],
        imports: [ CommonModule, FormsModule ]
      });
    });

    it('should get differences',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let ins: any = fixture.debugElement.queryAll(By.css('ins'));
            expect(ins.length).toBeGreaterThan(0);
            expect(ins[0].nativeElement.textContent).toBe('2');
            let del: any = fixture.debugElement.queryAll(By.css('del'));
            expect(del.length).toBeGreaterThan(0);
            expect(del[0].nativeElement.textContent).toBe('1');
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: `
  <qddt-diff
    [compared]="compared"
    [current]="current"
    [config]="config">
  </qddt-diff>
  `
})

class TestComponent {
  compared: any = {'name': 'test1', 'label': 'test1', version: {major: 1, minor: 0}};
  current: any = {'name': 'test12', 'label': 'test', version: {major: 2, minor: 0}};
  config: any[] = [
    {'name':'label','label':'Label'},
    {'name':'name','label':'Name'}
  ];
}
