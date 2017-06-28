import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { QddtTableComponent } from './table.component';
import { By } from '@angular/platform-browser';

export function main() {
  describe('Table component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ TestComponent, QddtTableComponent, EmptyComponent ],
        providers: [
        ],
        imports: [ CommonModule, FormsModule ]
      });
    });

    it('should get empty table',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(QddtTableComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('input'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

      it('should get table',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('input'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));
  });
}

@Component({
  selector: 'qddt-pagination',
  template: `
  <div>
  </div>
  `
})

class EmptyComponent {
  @Input() collectionSize: any;
  @Input() page: any;
  @Input() pageSize: any;
  @Input() maxSize: any;
  @Input() rotate: any;
  @Input() boundaryLinks: any;
}

@Component({
  selector: 'test-cmp',
  template: `
  <qddt-table [items]="items">
  </qddt-table>
  `
})

class TestComponent {
  items: any[] = [
    {'name': 'test1', 'label': 'test1'},
    {'name': 'test2', 'label': 'test2'}
  ];

}
