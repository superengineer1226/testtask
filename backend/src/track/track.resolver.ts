import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TrackService, TrackData } from './track.service';
import { Track } from './track.model';
import { Artist } from 'src/artist/artist.model';
import { ArtistDataLoader } from 'src/artist/artist.dataloader';


@Resolver(() => Track)
export class TrackResolver {
  constructor(
    private readonly trackService: TrackService,
    private readonly artistDataLoader: ArtistDataLoader,
  ) { }

  @Query(() => [Track])
  async getTracks(
    @Args('artistName') artistName: string,
    @Args('genreName') genreName: string,
    @Args('minPrice') minPrice: number,
    @Args('maxPrice') maxPrice: number,
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ): Promise<TrackData[]> {

    const tracks = await this.trackService.getTracks(
      artistName,
      genreName,
      minPrice,
      maxPrice,
      page,
      pageSize,
    );
    return tracks;
  }

  @ResolveField(() => Artist)
  async artist(@Parent() track: Track): Promise<Artist> {
    const artist = await this.artistDataLoader.generateDataLoader().load(track.artistId);
    return artist || null;
  }
}
