"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";



export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error);
            return;
        }

        const session = await getSession();

        try {
          const response = await fetch("/api/session", {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" },
        });
        

            if (!response.ok) {
                throw new Error(`Failed to fetch session: ${response.status}`);
            }

            
if (!session) {
    setError("No session found");
    return;
}

            const user = session.user;

            setLoading(false);

            if (user) {
                console.log("User:", user); // { id, email, role, lastLogin }
                router.push("/volunteer");
            } else {
                console.log("Executing 'No session found' block"); // Confirm execution
                setError("No session found"); // This block runs here
            }
        } catch (fetchError) {
            setLoading(false);
            setError(fetchError.message);
            console.error("Fetch error:", fetchError);
        }
    };

    return (
        <div className="min-h-screen text-black flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-2xl mb-4">Volunteer Sign In</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="border p-2 w-full"
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="border p-2 w-full"
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded w-full disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
}