"use client";

import { useState } from "react";
import { getServerSession } from "next-auth";

export default async function AddInstitutePage() {
  const [name, setName] = useState("");

  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/institutes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Add New Institute</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Institute Name"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add</button>
      </form>
    </div>
  );
}