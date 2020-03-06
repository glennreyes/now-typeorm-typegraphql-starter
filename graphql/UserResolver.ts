import {
  Query,
  Resolver,
  Mutation,
  Args,
  InputType,
  Field,
  ObjectType,
  Ctx,
} from 'type-graphql';
import { User } from '../db/entity/User';
import { MyContext } from '../api/graphql';
import { createAccessToken, createRefreshToken, isDev } from '../api/_utils';

@InputType()
class LoginInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class LoginPayload {
  @Field()
  accessToken: string;
}

@Resolver()
export default class UserResolver {
  @Mutation()
  async login(@Args() input: LoginInput, @Ctx() ctx: MyContext) {
    // TODO: Auth handler
    // const payload = await authenticate(input);
    const payload = { userId: 1 };

    ctx.res.setHeader(
      'Set-Cookie',
      `aid=${createRefreshToken(payload)}; HttpOnly${isDev ? '' : '; Secure'}`,
    );

    return { accessToken: createAccessToken(payload) };
  }

  @Query(() => User, { nullable: true })
  me() {
    return null;
  }
}
