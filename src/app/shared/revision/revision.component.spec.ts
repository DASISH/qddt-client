import { Component, Input, PipeTransform, Pipe } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RevisionService } from './revision.service';
import { RevisionComponent } from './revision.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export function main() {
  describe('Revision component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionComponent, RevisionComponent, LocalDatePipe,
          DiffComponent],
        providers: [
          { provide: RevisionService, useClass: RevisionServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule]
      });
    });

    it('should work with null revision',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(RevisionComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should work with revisions',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(RevisionComponent);
            fixture.componentInstance.current = {id: '1', name: 'name', classKind: 'TEST'};
            fixture.componentInstance.selectRevisionId = 1;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const td: any = fixture.debugElement.queryAll(By.css('td'));
              expect(td.length).toBe(7);
              expect(td[6].nativeNode.textContent).toContain('Information added');
            });
          });
      }));
  });
}

// override dependencies
class RevisionServiceSpy {
  getAllRevisions = jasmine.createSpy('getAllRevisions').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-diff',
  template: `<div></div>`
})

class DiffComponent {
  @Input() compared: any;
  @Input() current: any;
  @Input() config: any;
  @Input() hideCompareEvent: any;
}

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  transform(input: Array<number>): string {
    return '';
  }
}
