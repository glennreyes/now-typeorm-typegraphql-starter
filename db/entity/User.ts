import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, ID, Field } from 'type-graphql';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Field()
  @Column()
  displayName: string;
}
