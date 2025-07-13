import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/user";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

// NextAuth v5 compatible exports
export const getServerSession = (options?: any) => {
  // This is a compatibility function for code that expects the old getServerSession behavior
  return Promise.resolve({ user: null });
};

export const auth = () => {
  return { user: null };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          return null;
        }
        
        // Check if user is active and verification status
        if (!user.isActive) {
          throw new Error("Account has been deactivated. Please contact support.");
        }
        
        if (user.verificationStatus === 'rejected') {
          throw new Error("Your account verification was rejected. Please contact support.");
        }

        if (!user.password) {
          throw new Error("Please use social login or reset your password.");
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        
        if (!isPasswordValid) {
          return null;
        }

        // Update last login date
        user.lastLogin = new Date();
        await user.save();
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          company: user.company,
          role: user.role,
          verificationStatus: user.verificationStatus
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.company = user.company;
        token.verificationStatus = user.verificationStatus;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.company = token.company;
        session.user.verificationStatus = token.verificationStatus;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-default-secret',
};
