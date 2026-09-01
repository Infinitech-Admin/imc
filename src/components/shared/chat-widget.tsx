"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, X, Send, Boxes } from "lucide-react";

import { cn } from "@/lib/utils";

type ChatMessage = {
  id: number;
  from: "bot" | "user";
  text: string;
};

const INTRO: ChatMessage = {
  id: 0,
  from: "bot",
  text: "Hi, I'm the IMC assistant. Ask me about our products, a project, or how to reach the team.",
};

const QUICK_PROMPTS = [
  "What products do you supply?",
  "Where are you located?",
  "How do I request a quote?",
];

function getReply(input: string): string {
  const q = input.toLowerCase();

  if (
    /(product|insulation|ceiling|drywall|partition|thermobreak|armaflex|supaflex|material)/.test(
      q,
    )
  ) {
    return "We distribute imported materials for Insulations, Ceiling & Drywall Partitions, Thermobreak, and the ArmaFlex brand — including SUPAFLEX and THERMASHIELD lines. Check out the Products page for the full breakdown.";
  }
  if (/(quote|estimate|price|cost|brochure)/.test(q)) {
    return "The fastest way to get a quote or a copy of our product brochures is the Contact page — send us your details there and we'll follow up.";
  }
  if (/(location|address|where|office|branch)/.test(q)) {
    return "Our main office is at No. 23 Manhattan Street, Cubao, Quezon City, Philippines. We also have a Cebu branch at No. 13 ABB Compound, Zuellig Avenue, Mandaue City.";
  }
  if (/(project|portfolio|work|built|supplied|example)/.test(q)) {
    return "Take a look at the Projects page for our on-going, finished, and supplied projects — including work across the Philippines and a few overseas.";
  }
  if (/(contact|call|phone|email|reach)/.test(q)) {
    return "You can reach our main office at (632) 3410-3770 / 3411-6907, or email imcs23@yahoo.com. Our Cebu branch is at +63 922 834 7047. You can also use the form on the Contact page.";
  }
  if (/(hour|open|time)/.test(q)) {
    return "For current office hours, the Contact page is the best place to check, or just send us a message there and we'll get back to you.";
  }
  if (/(brand|import|supaflex|thermashield|armacell)/.test(q)) {
    return "We carry high-quality imported brands including SUPAFLEX, THERMASHIELD, and Armacell's ArmaFlex — see the Products page for what each is used for.";
  }
  return "Thanks for the message. For anything specific to your order or project, the Contact page is the best way to reach our team directly.";
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([INTRO]);
  const [value, setValue] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef(1);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: idRef.current++,
      from: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setValue("");
    setTyping(true);
    // Static canned response for now -- swap for a real API call to
    // `${NEXT_PUBLIC_API_URL}/chat` once the Laravel backend is live.
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: idRef.current++, from: "bot", text: getReply(trimmed) },
      ]);
      setTyping(false);
    }, 650);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[480px] w-[340px] flex-col overflow-hidden border border-blue-100 bg-white shadow-[0_28px_60px_-20px_rgba(10,30,48,0.45)] sm:w-[368px]">
          <div className="flex items-center justify-between bg-navy-900 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center border border-orange-500/70 text-orange-400">
                <Boxes className="size-4" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-base font-semibold tracking-wide text-white">
                  IMC Assistant
                </p>
                <p className="text-[11px] text-sky-200/60">
                  Typically replies in a few minutes
                </p>
              </div>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="size-4.5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-sky-50 px-4 py-4"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.from === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed",
                    m.from === "user"
                      ? "bg-blue-700 text-white"
                      : "border border-blue-100 bg-white text-ink",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 border border-blue-100 bg-white px-3.5 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-blue-400"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-col gap-2 pt-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="corner-brackets self-start border border-blue-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-blue-700 hover:border-orange-400 hover:text-orange-600"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(value);
            }}
            className="flex items-center gap-2 border-t border-blue-100 bg-white p-3"
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type a message..."
              className="h-10 flex-1 border border-blue-100 bg-sky-50 px-3 text-sm text-ink placeholder:text-steel-light/70 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex size-10 shrink-0 items-center justify-center bg-orange-500 text-white hover:bg-orange-600"
            >
              <Send className="size-4" />
            </button>
          </form>
          <p className="border-t border-blue-50 bg-white px-4 py-2 text-center text-[10.5px] text-steel-light">
            Prefer to talk directly?{" "}
            <Link
              href="/contact"
              className="font-medium text-blue-700 hover:text-orange-600"
            >
              Visit the contact page
            </Link>
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex size-14 items-center justify-center bg-orange-500 text-white shadow-[0_16px_32px_-12px_rgba(217,99,31,0.6)] transition-transform hover:scale-105 hover:bg-orange-600"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
