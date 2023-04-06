import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Artist {
  @Field()
  id: number;

  @Field()
  name: string;
}
