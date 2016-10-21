import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RationalComponent } from './rational.component';
import { MaterializeModule } from 'angular2-materialize';
import { FormsModule } from '@angular/forms';

export function main() {
  describe('Rational component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, RationalComponent],
        imports: [MaterializeModule, FormsModule]
      });
    });

    it('test rational work in progress',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let de = fixture.debugElement.queryAll(By.css('label'))
              .map(e => e.nativeElement);
            expect(de.length > 0).toBeTruthy();
            expect(de[0].textContent).toEqual('Saved as work in progress');
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
