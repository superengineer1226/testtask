import { Field, ObjectType } from '@nestjs/graphql';
import { Artist } from 'src/artist/artist.model';
@ObjectType()
export class Track {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  duration: number;

  @Field()
  genre: string;

  @Field()
  artistId: number

  @Field(() => Artist) // Define type for artist field
  artist?: Artist;
}
