import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import Campaign from "../../../models/Campaign";

export default async function CampaignDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const campaign = await Campaign.findById(params.id);

  if (!campaign) return <p>Campaign not found</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">{campaign.name}</h1>
      <p>Total Raised: ₹{campaign.totalRaised || 0}</p>
    </div>
  );
}