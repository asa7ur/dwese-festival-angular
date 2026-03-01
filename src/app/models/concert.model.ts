import { Artist } from './artist.model';
import { Stage } from './stage.model';

export interface Concert {
  id?: number;
  startTime: string;
  endTime: string;
  artist: Artist;
  stage: Stage;
}
