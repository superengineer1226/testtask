import { Module } from '@nestjs/common';
import { AlbumService } from './album/album.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AlbumResolver } from './album/album.resolver';

import { TrackResolver } from './track/track.resolver';
import { TrackService } from './track/track.service';
import { Database } from 'sqlite3';
import { ArtistService } from './artist/artist.service';
import { ArtistDataLoader } from './artist/artist.dataloader';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  providers: [
    AlbumService,
    AlbumResolver,
    TrackResolver,
    TrackService,
    ArtistService,
    ArtistDataLoader,
    {
      provide: Database,
      useFactory: () => new Database('chinook.sqlite'),
    },
  ],
})
export class AppModule {}
