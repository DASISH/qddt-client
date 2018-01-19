import { Component, Input } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { API_BASE_HREF } from '../api';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { UserService } from '../core/user/user.service';

class UserServiceSpy {
  get = jasmine.createSpy('get').and.callFake(function (key) {
    return {current: 'suvery', 'survey': {}};
  });
}

export function main() {
  describe('Home component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, HomeComponent, SurveyProgramComponent,
          StudyComponent, TopicComponent, ConceptComponent, GithubComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: UserService, useClass: UserServiceSpy },
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          },
          { provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [ CommonModule ]
      });
    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const de = fixture.debugElement.query(By.css('.card-title'));
            expect(de).not.toBeNull();
            expect(de.nativeElement).not.toBeNull();
            expect(de.nativeElement.textContent).toContain('Welcome QDDT');
          });
      }));
  });
}

@Component({
  selector: 'qddt-survey',
  template: `<div>
    </div>`
})
class SurveyProgramComponent {
  @Input() show: boolean;
}

@Component({
  selector: 'qddt-study',
  template: `<div>
    </div>`
})
class StudyComponent {
  @Input() show: boolean;
  @Input() survey: any;
}

@Component({
  selector: 'qddt-topic',
  template: `<div>
    </div>`
})
class TopicComponent {
  @Input() show: boolean;
  @Input() study: any;
}

@Component({
  selector: 'concept',
  template: `<div>
    </div>`
})
class ConceptComponent {
  @Input() show: boolean;
  @Input() topic: any;
}

@Component({
  selector: 'qddt-commit-list',
  template: `<div>
    </div>`
})
class GithubComponent {}

@Component({
  selector: 'test-component',
  template: `<qddt-home>
    </qddt-home>`
})
class TestComponent {}
