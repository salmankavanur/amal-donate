import connectToDatabase from "../../lib/db";
import Institute from "../../models/Institute";

export default async function InstitutesPage() {
  await connectToDatabase();
  const institutes = await Institute.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Institute Donations</h1>
      <ul className="space-y-2">
        {institutes.map((institute) => (
          <li key={institute._id} className="p-2 bg-white rounded shadow">
            <a href={`/donate/institutes/${institute._id}`}>{institute.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}