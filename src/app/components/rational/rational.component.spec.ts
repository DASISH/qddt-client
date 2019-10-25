import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RationalComponent } from './rational.component';
import { FormsModule } from '@angular/forms';

export function main() {
  describe('Rational component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, RationalComponent],
        imports: [ FormsModule]
      });
    });

    it('test rational work in progress',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const de = fixture.debugElement.queryAll(By.css('label'))
              .map(e => e.nativeElement);
            expect(de.length > 0).toBeTruthy();
            expect(de[0].textContent).toEqual('Save Comment');
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: '<qddt-rational [element]="element"></qddt-rational>'
})
class TestComponent {
  element: any = {};
}
