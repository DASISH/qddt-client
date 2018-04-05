import { TestBed, async } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { API_BASE_HREF } from '../api';

export function main() {
  describe('Category Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          CategoryService,
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ]
      });
    });

    it('should update category', async(() => {
      const service = TestBed.get(CategoryService);
      const survey: any = { id: '2', name: 'test' };
      service.save(survey).subscribe((data: any) => {
        expect(data.name).toBe('category');
      });
    }));

    it('should get all of categories', async(() => {
      const service = TestBed.get(CategoryService);
      service.getAll('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('category');
      });
    }));
  });
}
