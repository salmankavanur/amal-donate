// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/db";
import Admin from "../../../models/Admin";
import Volunteer from "../../../models/Volunteer";
import UserModel from "../../../models/User";

// Define TypeScript interfaces
interface CustomUser extends User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          await dbConnect();
          console.log("Database connected for auth");
        } catch (error) {
          console.error("Database connection error in authorize:", error);
          throw new Error("Database connection failed");
        }

        let user = await UserModel.findOne({ email: credentials.email });
        if (!user) user = await Admin.findOne({ email: credentials.email });
        if (!user) user = await Volunteer.findOne({ email: credentials.email });

        if (!user) {
          console.log("No user found for email:", credentials.email);
          throw new Error("No account found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.log("Invalid password for email:", credentials.email);
          throw new Error("Invalid password");
        }

        console.log("User authenticated:", user.email);

        return { 
          id: user._id.toString(), // Ensure this is a string representation of ObjectId
          email: user.email, 
          name: user.name || null, 
          role: user.role || "user" // Provide a default role if missing
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.email = customUser.email;
        token.name = customUser.name;
        token.role = customUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string | null,
          role: token.role as string,
        };
      }
      console.log("Session updated:", session);
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
























// import NextAuth, { NextAuthOptions, User } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import dbConnect from "../../../lib/db";
// import Admin from "../../../models/Admin";
// import Volunteer from "../../../models/Volunteer";
// import UserModel from "../../../models/User";

// // Define TypeScript interfaces
// interface CustomUser extends User {
//   id: string;
//   email: string;
//   name?: string;
//   role: string;
// }



// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials): Promise<CustomUser | null> {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         await dbConnect();

//         let user = await UserModel.findOne({ email: credentials.email });
//         if (!user) user = await Admin.findOne({ email: credentials.email });
//         if (!user) user = await Volunteer.findOne({ email: credentials.email });

//         if (!user) throw new Error("No account found with this email");

//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) throw new Error("Invalid password");

//         console.log("User authenticated:", user.email);

//         return { 
//           id: user._id.toString(), 
//           email: user.email, 
//           name: user.name, 
//           role: user.role 
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         const customUser = user as CustomUser;
//         token.id = customUser.id;
//         token.name = customUser.name;
//         token.email = customUser.email;
//         token.role = customUser.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           id: token.id as string,
//           name: token.name as string,
//           email: token.email as string,
//           role: token.role as string,
//         };
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   session: { strategy: "jwt" },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };