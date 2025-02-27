import Link from "next/link";

export default function DonateLayout({ children }) {
  return (
    <div>
      <header className="bg-blue-500 text-white p-4">
        <Link href="/" className="text-xl">Donation App</Link>
        <Link href="/auth/signin" className="ml-4">Sign In</Link>
      </header>
      <main className="p-6">{children}</main>
      
    </div>
  );
}