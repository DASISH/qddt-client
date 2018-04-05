import { TestBed, async } from '@angular/core/testing';

import { ResponseDomainService } from './responsedomain.service';
import { API_BASE_HREF } from '../api';

export function main() {
  describe('Responsedomain service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          ResponseDomainService,
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ]
      });
    });

    it('should update responsedomain', async(() => {
      const service = TestBed.get(ResponseDomainService);
      const question: any = { id: '2', name: 'test' };
      service.update(question).subscribe((data: any) => {
        expect(data.name).toBe('responsedomain');
      });
    }));

    it('should get all of responsedomains', async(() => {
      const service = TestBed.get(ResponseDomainService);
      service.getAll('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('responsedomain');
      });
    }));
  });
}
