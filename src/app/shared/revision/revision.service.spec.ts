import { TestBed, async } from '@angular/core/testing';

import { RevisionService } from './revision.service';
import { API_BASE_HREF } from '../../api';

export function main() {
  describe('Revision Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          RevisionService,
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ]
      });
    });

    it('should get all of revisions', async(() => {
      const service = TestBed.get(RevisionService);
      service.getAllRevisions('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].content.entity.name).toContain('topic');
      });
    }));
  });
}
