"use client";

import { useState } from "react";
import { getServerSession } from "next-auth";

export default async function TemplatesPage() {
  const [template, setTemplate] = useState("");

  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/notifications/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template }),
    });
    setTemplate("");
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Manage Templates</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Notification Template"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save Template</button>
      </form>
    </div>
  );
}