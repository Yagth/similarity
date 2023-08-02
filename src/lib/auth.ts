import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("No clientID for google provider set");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("No clientSecret for google provider set");
  }

  return { clientId, clientSecret };
}

let authOptions: NextAuthOption;
if (typeof window === "undefined") {
  const { PrismaAdapter } = require("@next-auth/prisma-adapter");
  const { db } = require("@/lib/db");

  authOptions = {
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    callbacks: {
      session({ token, session }) {
        if (token) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;
        }

        return session;
      },
      async jwt({ token, user }) {
        const dbuser = await db.user.findFirst({
          where: {
            email: "",
          },
        });

        if (!dbuser) {
          token.id = user!.id; // ! used to let typescript know that we know the variable user exists and it shouldn't complain about it
          return token;
        }
        return {
          id: dbuser.id,
          name: dbuser.name,
          email: dbuser.email,
          picture: dbuser.image,
        };
      },
      redirect() {
        return "/dashboard";
      },
    },
    adapter: PrismaAdapter(db),
    providers: [
      GoogleProvider({
        clientId: getGoogleCredentials().clientId,
        clientSecret: getGoogleCredentials().clientSecret,
      }),
    ],
  };
}

export { authOptions };
