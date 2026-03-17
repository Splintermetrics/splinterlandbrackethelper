"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      return;
    }

    router.push(`/analyze/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
      <input
        className="w-full rounded-2xl border border-line bg-panel px-4 py-3 text-base outline-none ring-0 placeholder:text-textSoft"
        placeholder="Enter Splinterlands username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button
        type="submit"
        className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        Analyze collection
      </button>
    </form>
  );
}
