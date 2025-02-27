import Link from "next/link";
import { getServerSession } from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    redirect("/auth/admin/signin");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl mb-4">Admin Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="block p-2 hover:bg-gray-700">Overview</Link></li>
            <li><Link href="/dashboard/donations" className="block p-2 hover:bg-gray-700">Donations</Link></li>
            <li><Link href="/dashboard/campaigns" className="block p-2 hover:bg-gray-700">Campaigns</Link></li>
            <li><Link href="/dashboard/institutes" className="block p-2 hover:bg-gray-700">Institutes</Link></li>
            <li><Link href="/dashboard/notifications" className="block p-2 hover:bg-gray-700">Notifications</Link></li>
            <li><Link href="/dashboard/sponsorships" className="block p-2 hover:bg-gray-700">Sponsorships</Link></li>
            <li><Link href="/dashboard/volunteers" className="block p-2 hover:bg-gray-700">Volunteers</Link></li>
            <li><Link href="/dashboard/receipts" className="block p-2 hover:bg-gray-700">Receipts</Link></li>
            <li><Link href="/dashboard/boxes" className="block p-2 hover:bg-gray-700">Boxes</Link></li>
            <li><Link href="/dashboard/agents" className="block p-2 hover:bg-gray-700">Agents</Link></li>
            <li><Link href="/dashboard/settings" className="block p-2 hover:bg-gray-700">Settings</Link></li>
            <li><Link href="/dashboard/reports" className="block p-2 hover:bg-gray-700">Reports</Link></li>
            <li><Link href="/auth/admin/signout" className="block p-2 hover:bg-gray-700">Sign Out</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}