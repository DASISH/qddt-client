import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { QddtPaginationComponent } from './pagination';

export function main() {
  describe('Pagination Component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, QddtPaginationComponent]
      });
    });

    it('checking of working with default values',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture: any = TestBed.createComponent(QddtPaginationComponent);
            let context: any = fixture.debugElement.componentInstance;
            let element: any = fixture.nativeElement;
            fixture.detectChanges();
            const listItems = element.querySelectorAll('li');
            const links = element.querySelectorAll('a');

            context.disabled = true;
            fixture.detectChanges();

            expect(listItems.length).toEqual(2);
            expect(listItems[0].classList).toContain('disabled');
            expect(listItems[1].classList).toContain('disabled');

            expect(links[0].textContent).toContain('«');
            expect(links[1].textContent).toContain('»');
          });
      }));

    it('checking of working with several pages',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture: any = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let element: any = fixture.nativeElement;
            const listItems = element.querySelectorAll('li');
            const links = element.querySelectorAll('a');

            expect(listItems.length).toBe(6);
            expect(listItems[0].classList).toContain('disabled');

            expect(links[0].textContent).toContain('««');
            expect(links[1].textContent).toContain('«');

          });
      }));

  });
}
@Component({
  selector: 'test-cmp',
  template: `
  <qddt-pagination
    [collectionSize]="30"
    [page]="0"
    [pageSize]="20"
    [maxSize]="5"
    [rotate]="true"
    [boundaryLinks]="true">
  </qddt-pagination>
  `
})

class TestComponent {
}
