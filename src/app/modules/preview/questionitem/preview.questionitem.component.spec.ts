import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { PreviewQuestionitemComponent } from './preview.questionitem.component';
import { API_BASE_HREF } from '../../../api';
import { MaterializeModule } from 'angular2-materialize';
import {PublicationService} from '../../../lib/services';
import {QuestionItem} from '../../../lib/classes';

export function main() {
  describe('Publication questionitem preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ PreviewQuestionitemComponent, PreviewResponsedomainComponent],
        providers: [
          { provide: PublicationService, useClass: PublicationServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewQuestionitemComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with questionitem',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewQuestionitemComponent);
            const element =  new QuestionItem({
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : 132424312421,
                'name' : 'one questionitem',
                'question': 'test',
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null }
            });
            fixture.componentInstance.questionItem = element;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any = fixture.debugElement.queryAll(By.css('li'));
              expect(de.length).toBeGreaterThan(3);
              expect(de[3].nativeNode.textContent).toContain('test');
            });
          });
      }));
  });
}

// override dependencies
class PublicationServiceSpy {
  searchPublications = jasmine.createSpy('searchPublications').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class PreviewResponsedomainComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}
