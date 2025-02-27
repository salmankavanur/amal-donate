import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {SessionProvider} from "../lib/Context/SessionContext"

export default async function VolunteerLayout({ children }) {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session || session.user.role !== "Volunteer") {
    return redirect("/auth/volunteer/signin");
  }

  return (
    <div>
      <header className="bg-blue-500 text-white p-4">
        <Link href="/" className="text-xl">Donation App</Link>
        <Link href="/auth/volunteer/signout" className="ml-4">Sign Out</Link>
      </header>
      <SessionProvider session={session}>

      <main className="p-6">{children}</main>
      </SessionProvider>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 Donation App</p>
      </footer>
    </div>
  );
}