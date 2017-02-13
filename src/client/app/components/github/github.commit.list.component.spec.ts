import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { CommitListComponent } from './github.commit.list.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { API_BASE_HREF } from '../../api';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

export function main() {
  describe('Github commit list component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, CommitListComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
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

    it('should work with empty commit',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '[]'
              })));
            });
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let de = fixture.debugElement.queryAll(By.css('.section'));
            expect(de.length).toBe(0);
          });
      }));

    it('should get commit',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '[{"commit" : {"message":"1", "author":{"date":"1"}}, "html_url" : "1", "sha" : "2"}]'
              })));
            });
            let fixture = TestBed.createComponent(TestComponent);
            let section = fixture.debugElement.queryAll(By.css('.section'));
            expect(section.length).toBe(0);
            fixture.detectChanges();
            let de = fixture.debugElement.queryAll(By.css('.section'));
            expect(de.length).toBe(1);
          });
      }));
  });
}

@Component({
  selector: 'test-component',
  template: `<qddt-commit-list>
    </qddt-commit-list>`
})
class TestComponent {

}
