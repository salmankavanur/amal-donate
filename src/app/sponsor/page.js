import Link from "next/link";

export default function SponsorPage() {
  return (
    <div>
      <h1 className="text-2xl mb-4">Sponsorship Programs</h1>
      <Link href="/sponsor/yatheem" className="bg-blue-500 text-white p-2 rounded mr-2">Sponsor a Yatheem</Link>
      <Link href="/sponsor/hafiz" className="bg-blue-500 text-white p-2 rounded">Sponsor a Hafiz</Link>
    </div>
  );
}