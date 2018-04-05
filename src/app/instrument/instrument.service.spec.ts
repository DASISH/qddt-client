import { TestBed, async } from '@angular/core/testing';

import { InstrumentService } from './instrument.service';
import { API_BASE_HREF } from '../api';

export function main() {
  describe('Instrument Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          InstrumentService,
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ]
      });
    });

    it('should update instrument', async(() => {
      const service = TestBed.get(InstrumentService);
      const instrument: any = { id: '2', name: 'test' };
      service.update(instrument).subscribe((data: any) => {
        expect(data.name).toBe('instrument');
      });
    }));

    it('should create instrument', async(() => {
      const service = TestBed.get(InstrumentService);
      service.create({name: 'test'}).subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('instrument');
      });
    }));
  });
}
