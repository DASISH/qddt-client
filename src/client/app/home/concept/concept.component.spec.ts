import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ConceptService } from './concept.service';
import { ConceptComponent } from './concept.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Concept component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConceptComponent, RevisionComponent,
          ConceptTocComponent, TreeNodeComponent,
          ConceptEditComponent, CommentListComponent, AuthorChipComponent],
        providers: [
          { provide: ConceptService, useClass: ConceptServiceSpy },
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
            const fixture = TestBed.createComponent(ConceptComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBe(0);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any = fixture.debugElement.queryAll(By.css('a'));
              expect(de.length).toBeGreaterThan(0);
            });
          });
      }));

    it('should work with topic',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ConceptComponent);
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const treenodes: any = fixture.debugElement.queryAll(By.css('qddt-concept-treenode'));
              expect(treenodes.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

//override dependencies
class ConceptServiceSpy {
  getByTopic = jasmine.createSpy('getByTopic').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-comment-list',
  template: `<div></div>`
})

class CommentListComponent {
  @Input() ownerId: any;
  @Input() comments: any[];
}

@Component({
  selector: 'concept-edit',
  template: `<div></div>`
})

class ConceptEditComponent {
  @Input() concept: any;
  @Input() isVisible: boolean;
}

@Component({
  selector: 'qddt-concept-toc',
  template: `<div></div>`
})

class ConceptTocComponent {
  @Input() concepts: any;
  @Input() level: number;
}

@Component({
  selector: 'qddt-concept-treenode',
  template: `<div></div>`
})

class TreeNodeComponent {
  @Input() concept: any;
}

@Component({
  selector: 'qddt-revision',
  template: `<div></div>`
})

class RevisionComponent {
  @Input() isVisible: any;
  @Input() config: any;
  @Input() qddtURI: any;
  @Input() current: any;
}

@Component({
  selector: 'qddt-author-chip',
  template: `<div></div>`
})

class AuthorChipComponent {
  @Input() authors: any;
}
