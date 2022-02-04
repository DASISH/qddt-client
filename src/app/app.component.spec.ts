import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing'; // 1
import { API_BASE_HREF } from './api';
import { AppComponent } from './app.component';
import { MessageService, PropertyStoreService, UserService } from './lib/services';
import { SearchComponent } from './modules/search/search.component';

describe('AppComponent', () => { // 2
  let token = 'api.base.href';
  beforeEach(waitForAsync(() => { // 3
    TestBed.configureTestingModule({
      declarations: [ AppComponent, SearchComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: API_BASE_HREF, useValue: token },
        MessageService,
        PropertyStoreService,
        UserService,
      ]
    }).compileComponents();
  }));

  it('should create the app', () => { // 4
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have 'api.base.href' as users.api`, () => {  //5
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.users.api).toEqual(token);
  });

  it('should render Welcome text in a p tag', () => { //6
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    debugger;
    expect(compiled.querySelector('p').textContent).toContain('Welcome to the QDDT');
  });
});
