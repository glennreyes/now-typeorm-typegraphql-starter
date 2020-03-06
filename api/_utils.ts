import jwt from 'jsonwebtoken';

export const isDev = process.env.NODE_ENV !== 'production';

export const parseJson = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw Error(`Couldn't parse data.`);
  }
};

type Payload = string | object | Buffer;

export const createAccessToken = (payload: Payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
export const createRefreshToken = (payload: Payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
