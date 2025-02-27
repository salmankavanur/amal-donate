import Link from "next/link";

export default function SponsorLayout({ children }) {
  return (
    <div>
      <header className="bg-blue-500 text-white p-4">
        <Link href="/" className="text-xl">Donation App</Link>
        <Link href="/auth/signin" className="ml-4">Sign In</Link>
      </header>
      <main className="p-6">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 Donation App</p>
      </footer>
    </div>
  );
}