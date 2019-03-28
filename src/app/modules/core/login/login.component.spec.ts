import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import {API_BASE_HREF} from '../../../api';

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
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('input'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should login',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(LoginComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('button'));
            expect(de.length).toBeGreaterThan(0);
            de[0].nativeElement.click();
            fixture.detectChanges();
          });
      }));
  });
}

@Component({
  selector: 'qddt-test-cmp',
  template: `
  <qddt-login>
  </qddt-login>
  `
})
class TestComponent {

}
