"use client";

import { useState } from "react";
import {useSession} from "../../lib/Context/SessionContext"

export default  function AddBoxPage() {
  const session=useSession();
  console.log(session);
 
  // if (!session || session.user.role !== "Volunteer") {
  //   return <p>Access Denied</p>;
  // }

  const [serialNumber, setSerialNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/boxes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serialNumber, holderName: "Unknown", status: "Active" }),
    });
    setSerialNumber("");
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Add New Box</h1>
      <h1>{session.user.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="Serial Number"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Box</button>
      </form>
    </div>
  );
}