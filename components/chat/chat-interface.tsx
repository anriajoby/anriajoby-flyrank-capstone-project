
"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function ChatInterface() {
  const { messages, sendMessage, status, stop } = useChat();

  const [input, setInput] = useState("");

  const isBusy = status === "submitted" || status === "streaming";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isBusy) return;

    sendMessage({ text: trimmedInput });
    setInput("");
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold">
          TripTale Travel Assistant
        </h2>
        <p className="text-muted">
          Tell me where you want to go, and let&apos;s plan your next adventure.
        </p>
      </header>

      <div className="rounded-lg border border-border bg-white p-6">
      {messages.length === 0 ? (
  <p className="text-muted">
    Your travel conversation will appear here.
  </p>
) : (
  <div className="space-y-5">
    {messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[85%] rounded-lg p-4 ${
            message.role === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <p className="mb-2 text-xs font-semibold opacity-70">
            {message.role === "user" ? "You" : "TripTale"}
          </p>

          {message.parts.map((part, index) =>
            part.type === "text" ? (
              <p key={index} className="whitespace-pre-wrap">
                {part.text}
              </p>
            ) : null
          )}
        </div>
      </div>
    ))}
  </div>
)}
{status === "submitted" && (
        <div className="flex justify-start">
          <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
            TripTale is thinking...
          </div>
        </div>
      )}

        {isBusy && (
          <button
            type="button"
            onClick={stop}
            className="mt-4 rounded-md border border-border px-4 py-2"
          >
            Stop generating
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask TripTale about your next trip..."
          rows={2}
          disabled={isBusy}
          className="w-full rounded-lg border border-border bg-white p-3 text-foreground outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
