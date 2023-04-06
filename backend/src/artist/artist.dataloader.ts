import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
import * as DataLoader from 'dataloader';
import { Artist } from './artist.model';
import { ArtistService } from './artist.service';

@Injectable()
export class ArtistDataLoader implements NestDataLoader<number, Artist> {
  constructor(private readonly artistService: ArtistService) {}

  generateDataLoader(): DataLoader<number, Artist> {
    return new DataLoader<number, Artist>(async (keys: readonly number[]) => {
      const artists = await this.artistService.findByIds([...keys]);
      const artistMap = new Map<number, Artist>();
      artists.forEach((artist: Artist) => {
        artistMap.set(artist.id, artist);
      });
      return keys.map((id) => artistMap.get(id));
    });
  }
}
