import clientPromise from '@/lib/mongodb'
import { mongooseConnect } from '@/lib/mongoose';
import { Admin } from '@/models/Admins';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// const adminEmails = ['letov88@gmail.com', 'ivan.o.letov@gmail.com'];

async function isAdminEmail(email) {
  mongooseConnect();
  return !! (await Admin.findOne({email}));
}

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session, token, user}) => {
      // console.log({session, token, user})
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
}

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw 'Not an Admin';
  }
}