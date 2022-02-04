import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { API_BASE_HREF, MessageService, PropertyStoreService, TemplateService, UserService } from 'src/app/lib';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([]) ],
      providers: [
        { provide: API_BASE_HREF, useValue: 'api.base.href' },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 3 }),
            snapshot: {
              params: {
                id: 1
              },
              paramMap: {
                get(name: string): string {
                  return '';
                }
              }
            },
          }
        },
        MessageService,
        PropertyStoreService,
        TemplateService,
        UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
