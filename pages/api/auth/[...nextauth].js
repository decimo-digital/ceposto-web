import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import { axiosAuth } from 'utils/axiosInstance';
import cookie from 'js-cookie'
import { addGoogleToken } from 'utils/addGoogleToken';

const options = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.SECRET,

  session: {
    jwt: true,
  },

  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: 'SomeSecret',
  },
  callbacks: {
    // jwt: async (token, user, account, profile, isNewUser) => { return Promise.resolve(token) }
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (typeof account !== 'undefined') {
        const { data: x } = await axiosAuth.post('/google', { token: account.id_token })
        token.accessToken = x.accessToken
      }
      return Promise.resolve(token)
    },

    session: async ({ session, token, user }) => {
      session.accessToken = token.accessToken
      return session;
    },
  },
  events: {},
}

export default (req, res) => NextAuth(req, res, options)