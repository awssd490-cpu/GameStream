import { useState, type FormEvent } from "react";
import { Send, Search, Phone, Video } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

interface Chat {
  id: number;
  name: string;
  initials: string;
  online: boolean;
  messages: { from: "me" | "them"; text: string; time: string }[];
}

const chats: Chat[] = [
  {
    id: 1,
    name: "Aria",
    initials: "AR",
    online: true,
    messages: [
      { from: "them", text: "You up for a ranked match later?", time: "3:12 PM" },
      { from: "me", text: "Yeah! Give me 30 minutes.", time: "3:14 PM" },
      { from: "them", text: "Perfect. I'll grab the lobby.", time: "3:15 PM" },
    ],
  },
  {
    id: 2,
    name: "Kael",
    initials: "KA",
    online: true,
    messages: [
      { from: "them", text: "New map drops tomorrow", time: "12:02 PM" },
    ],
  },
  {
    id: 3,
    name: "Mira",
    initials: "MI",
    online: false,
    messages: [
      { from: "me", text: "Did you see the patch notes?", time: "Yesterday" },
    ],
  },
];

/**
 * Direct messages. A thread list on the left and an active conversation
 * on the right — the layout the future DM/chat data layer plugs into.
 */
export function MessagesPage() {
  const [activeId, setActiveId] = useState(1);
  const [draft, setDraft] = useState("");
  // Messages for the active thread, kept in state so sends re-render.
  const [messages, setMessages] = useState(chats[0].messages);

  const chat = chats.find((c) => c.id === activeId) ?? chats[0];

  const selectChat = (id: number) => {
    setActiveId(id);
    setMessages(chats.find((c) => c.id === id)?.messages ?? []);
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "me", text: draft.trim(), time: "Now" },
    ]);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Messages" description="Direct messages with your friends." />

      <div className="flex min-h-0 flex-1 gap-3 px-6 pb-6">
        {/* Thread list */}
        <aside className="flex w-64 shrink-0 flex-col rounded-xl border border-border bg-card">
          <div className="p-3 pb-2">
            <div className="flex h-8 items-center gap-2 rounded-md bg-black/30 px-2.5 text-muted-foreground">
              <Search className="size-4 shrink-0" />
              <input
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2">
            {chats.map((c) => (
              <button
                key={c.id}
                onClick={() => selectChat(c.id)}
                className={cn(
                  "mb-1 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
                  c.id === activeId ? "bg-white/10" : "hover:bg-white/5",
                )}
              >
                <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-blurple/25 text-xs font-semibold text-blurple">
                  {c.initials}
                  {c.online && (
                    <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.messages[c.messages.length - 1]?.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Conversation */}
        <section className="flex min-w-0 flex-1 flex-col rounded-xl border border-border bg-card">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-blurple/25 text-[10px] font-semibold text-blurple">
              {chat.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{chat.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">
                {chat.online ? "Online" : "Offline"}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label="Voice call"
                title="Voice call"
              >
                <Phone className="size-4" />
              </button>
              <button
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label="Video call"
                title="Video call"
              >
                <Video className="size-4" />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto p-3 space-y-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[70%] rounded-xl px-3 py-2 text-sm",
                  m.from === "me"
                    ? "self-end bg-blurple text-blurple-foreground"
                    : "self-start bg-surface-3",
                )}
              >
                <p className="break-words">{m.text}</p>
                <p className={cn("mt-0.5 text-[10px]", m.from === "me" ? "text-blurple-foreground/60" : "text-muted-foreground")}>
                  {m.time}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="shrink-0 p-3">
            <div className="flex h-10 items-center gap-2 rounded-lg bg-surface-3 px-3">
              <input
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder={`Message ${chat.name}`}
                value={draft}
                onChange={(e) => setDraft(e.currentTarget.value)}
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
