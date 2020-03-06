import { NowRequest, NowResponse } from '@now/node';
import { verifyRefreshToken, createAccessToken } from './_utils';

export default (req: NowRequest, res: NowResponse) => {
  const token = req.cookies.aid;

  if (!token) {
    return res.json({ success: false, accessToken: '' });
  }

  try {
    const { iat, exp, ...payload }: any = verifyRefreshToken(token);

    // TODO: Verify if the user exists in the db

    return res.json({
      success: true,
      accessToken: createAccessToken(payload),
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, accessToken: '' });
  }
};
