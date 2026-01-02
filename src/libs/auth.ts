// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'

// Data Imports
import { users } from '../app/api/login/users'

export const authOptions: NextAuthOptions = {
  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */
        const { email, password } = credentials as { email: string; password: string }

        if (!email || !password) {
          throw new Error(JSON.stringify({ message: ['Email and password are required'] }))
        }

        try {
          // ** Directly check user credentials against the users array (no HTTP call needed)
          // ** This is more reliable and faster than making an HTTP request to ourselves
          const user = users.find(u => u.email === email && u.password === password)

          if (user) {
            // ** Remove password from user object before returning
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, ...userWithoutPassword } = user

            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            return userWithoutPassword
          } else {
            // ** Invalid credentials - throw error with proper format
            throw new Error(JSON.stringify({ message: ['Email or Password is invalid'] }))
          }
        } catch (error: any) {
          // If error is already a stringified JSON, re-throw it
          if (error.message && error.message.startsWith('{')) {
            throw error
          }

          // Otherwise, wrap it in our error format
          throw new Error(JSON.stringify({ message: [error.message || 'An error occurred during authentication'] }))
        }
      }
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * Since we're not using a database adapter, we must use JWT strategy.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }) {
      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.image = user.image
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
      }

      return session
    }
  },

  // ** Secret for encrypting the JWT token
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this-in-production'
}
