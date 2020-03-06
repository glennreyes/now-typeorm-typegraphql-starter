import { NowRequest, NowResponse } from '@now/node';
import { ApolloServer } from 'apollo-server-micro';
import { compose } from 'lodash/fp';
import { buildSchema } from 'type-graphql';
import { isDev, verifyAccessToken } from './_utils';
import { connect } from '../db';
import UserResolver from '../graphql/UserResolver';

export type MyContext = {
  payload?: object;
  req: NowRequest;
  res: NowResponse;
};

const handler = async (req: NowRequest, res: NowResponse) => {
  const server = new ApolloServer({
    context: ({ req, res }: MyContext) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return { req, res };
        const payload = verifyAccessToken(token);

        return { payload, req, res };
      } catch (error) {
        console.error(error);

        return { req, res };
      }
    },
    mocks: isDev,
    mockEntireSchema: false,
    schema: await buildSchema({ resolvers: [UserResolver] }),
  });

  return server.createHandler()(req, res);
};

const withDbConnection = (
  handler: (req: NowRequest, res: NowResponse) => Promise<void>,
) => async (req: NowRequest, res: NowResponse) => {
  await connect();
  return await handler(req, res);
};

const withCors = (
  handler: (req: NowRequest, res: NowResponse) => Promise<void>,
) => async (req: NowRequest, res: NowResponse) =>
  req.method === 'OPTIONS' ? res.end() : await handler(req, res);

export default compose(withDbConnection, withCors)(handler);
