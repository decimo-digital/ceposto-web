import { getToken } from 'next-auth/jwt';

const secret = process.env.SECRET;
let accessToken;

export default async (req, res) => {
  try {
    const token = await getToken({
      req,
      secret,
      encryption: true,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error)
  }

};