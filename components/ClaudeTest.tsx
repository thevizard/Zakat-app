"use client";

import { useState } from "react";

export function ClaudeTest() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResponse(data.message);
      setInput("");
    } catch (err) {
      setError("Failed to connect to Claude API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Claude API Test</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Claude something..."
          className="w-full border p-2 rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-bold">Claude says:</p>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}