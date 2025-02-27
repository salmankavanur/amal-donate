import connectToDatabase from "../../lib/db";
import Campaign from "../../models/Campaign";

export default async function CampaignsPage() {
  await connectToDatabase();
  const campaigns = await Campaign.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Campaign Donations</h1>
      <ul className="space-y-2">
        {campaigns.map((campaign) => (
          <li key={campaign._id} className="p-2 bg-white rounded shadow">
            <a href={`/donate/campaigns/${campaign._id}`}>{campaign.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}