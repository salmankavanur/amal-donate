import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Ensure correct path
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    
    if (!session || !["Admin", "Staff", "Manager", "Super Admin"].includes(session.user?.role)) {
        return redirect("/unauthorized"); // Redirect to an unauthorized page or login
    }

    return (
        <div className="text-black">
            <h1>Welcome to the Dashboard</h1>
            <p>Only authorized users can see this page.</p>
            
        </div>
    );
}
