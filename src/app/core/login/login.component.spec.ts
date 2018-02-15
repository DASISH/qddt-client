import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { API_BASE_HREF } from '../../api';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { UserService } from '../user/user.service';

class UserServiceSpy {
  get = jasmine.createSpy('get').and.callFake(function (key) {
    return { username: 'qddt', email: 'test@qddt.no' };
  });
}
export function main() {
  describe('Login component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ TestComponent, LoginComponent ],
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
          },
          { provide: UserService, useClass: UserServiceSpy }
        ],
        imports: [ CommonModule, FormsModule ]
      });
    });

    it('should get login visible',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('input'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should login',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(LoginComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('button'));
            expect(de.length).toBeGreaterThan(0);
            de[0].nativeElement.click();
            fixture.detectChanges();
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: `
  <qddt-login>
  </qddt-login>
  `
})
class TestComponent {

}
