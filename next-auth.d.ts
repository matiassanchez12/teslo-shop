import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      name: string;
    };
  }
}