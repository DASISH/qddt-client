import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { QddtAutoCompleteComponent } from './autocomplete.component';
import { By } from '@angular/platform-browser';

export function main() {
  describe('autocomplete component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ TestComponent, QddtAutoCompleteComponent ],
        providers: [
        ],
        imports: [ CommonModule, FormsModule ]
      });
    });

    it('should get autocomplete visible',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('input'));
            expect(de.length).toBeGreaterThan(0);
            de[0].triggerEventHandler('focus', {});
            de[0].triggerEventHandler('keyup', {target: {value: 't'}});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const autocomplete: any = fixture.debugElement.queryAll(By.css('li'));
              expect(autocomplete.length).toBe(2);
            });
          });
      }));
  });
}

@Component({
  selector: 'qddt-test-cmp',
  template: `
  <qddt-auto-complete
    [items]="items"
    [searchField]="'label'"
    [initialValue]="''">
  </qddt-auto-complete>
  `
})
class TestComponent {
  items: any[] = [
    {'name': 'test1', 'label': 'test1'},
    {'name': 'test2', 'label': 'test2'}
  ];

}
