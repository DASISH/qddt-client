import { TestBed, async } from '@angular/core/testing';
import { SequenceService } from './sequence.service';
import { API_BASE_HREF } from '../api';
import { ElementKind } from '../preview/preview.service';

export function main() {
  describe('Sequence service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          SequenceService,
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ]
      });
    });

    it('should update sequence', async(() => {
      const service = TestBed.get(SequenceService);
      const sequence: any = { id: '2', name: 'test' };
      service.update(sequence).subscribe((data: any) => {
        expect(data.name).toBe('sequence');
      });
    }));

    it('should get all of sequences', async(() => {
      const service = TestBed.get(SequenceService);
      service.getElements(ElementKind.SEQUENCE_CONSTRUCT, '1')
        .subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('sequence');
      });
    }));
  });
}
