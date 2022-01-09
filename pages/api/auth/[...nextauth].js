import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import { axiosAuth } from 'utils/axiosInstance';

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
      const { data: x } = await axiosAuth.post('/google', { token: account.id_token })
      console.log(x)

      const isSignIn = (user) ? true : false
      // Add auth_time to token on signin in
      if (isSignIn) { token.custom = 'abc' }
      return Promise.resolve(token)
    },

  },
  events: {},
}

export default (req, res) => NextAuth(req, res, options)