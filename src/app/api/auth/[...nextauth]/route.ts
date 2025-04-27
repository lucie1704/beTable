import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "bcrypt";
import type { UserRecord } from "@/types/user";
import Airtable from 'airtable';

const apiKey = process.env.AIRTABLE_API_KEY!;
const baseId = process.env.AIRTABLE_BASE_ID!;

const base = new Airtable({ apiKey }).base(baseId);

const getUserFromAirtable = async (email: string) => {
  const records = await base('Utilisateur').select({
    filterByFormula: `{Email} = "${email}"`,
    maxRecords: 1,
  }).firstPage();

  if (records.length > 0) {
    return records[0] as unknown as UserRecord;
  }
  return null;
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await getUserFromAirtable(credentials.email);

        if (!user) {
          return null;
        }

        const isPasswordValid = await jwt.compare(credentials.password, user.fields['Mot de passe']);
        
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.fields.Prénom + ' ' + user.fields.Nom,
          email: user.fields.Email,
          role: user.fields.Rôle,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
