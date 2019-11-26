import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatementEditComponent } from './statementconstruct.edit.component';
import { API_BASE_HREF } from '../../../api';
import { TemplateService } from '../../../lib/services';

export function main() {
  describe('statement edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, StatementEditComponent],
        providers: [
          { provide: TemplateService, useClass: SequenceServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule]
      });
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(StatementEditComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('textarea'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should create statement',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(TestComponent);
            const de: any[] = fixture.debugElement.queryAll(By.css('button'));
            expect(de.length).toBeGreaterThan(0);
            de[0].nativeElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.element.name).toBe('one statement');
            });
          });
      }));
  });
}

// override dependencies
class SequenceServiceSpy {
  create = jasmine.createSpy('create').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-test',
  template: `<div><qddt-statement-edit (element)="onElement($event)"></qddt-statement-edit></div>`
})

class TestComponent {
  element: any;

  onElement(element: any) {
    this.element = element;
  }
}
