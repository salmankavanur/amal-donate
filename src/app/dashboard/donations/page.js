// import { getServerSession } from "next-auth";
import connectToDatabase from "../../lib/db";
import Donation from "../../models/Donation";

export default async function DonationsPage() {
  // const session = await getServerSession();
  // if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
  //   return <p>Access Denied</p>;
  // }

  await connectToDatabase();
  const donations = await Donation.find({});

  return (
    <div className="text-black">
      <h1 className="text-2xl mb-4 ">Donation Management</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Type</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id} className="border-t">
              <td className="p-2">{donation._id.toString()}</td>
              <td className="p-2">₹{donation.amount}</td>
              <td className="p-2">{donation.type}</td>
              <td className="p-2">{donation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}