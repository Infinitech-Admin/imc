"use client";

import * as React from "react";
import { Share2, X } from "lucide-react";

import { socialLinks } from "@/data/nav";
import {
  FacebookIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  ViberIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/social-icons";

const iconMap = {
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
  phone: PhoneIcon,
  email: MailIcon,
  viber: ViberIcon,
  instagram: InstagramIcon,
  telegram: TelegramIcon,
};

const colorMap: Record<keyof typeof iconMap, string> = {
  facebook: "bg-[#1877F2]",
  whatsapp: "bg-[#25D366]",
  phone: "bg-[#2FB77E]",
  email: "bg-[#B23A2E]",
  viber: "bg-[#7360F2]",
  instagram: "bg-gradient-to-br from-[#FED373] via-[#E1306C] to-[#833AB4]",
  telegram: "bg-[#2CA5E0]",
};

export function FloatingSocial() {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Desktop: always-visible rail */}
      <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-[3px] md:flex">
        {socialLinks.map((s) => {
          const Icon = iconMap[s.icon];
          const color = colorMap[s.icon];
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s.label}
              className={`group flex size-11 items-center justify-center rounded-l-xl text-white shadow-[0_8px_18px_-8px_rgba(0,0,0,0.55)] transition-transform duration-200 hover:-translate-x-1.5 ${color}`}
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </a>
          );
        })}
      </div>

      {/* Mobile: collapsed toggle that expands to the full list */}
      <div
        ref={rootRef}
        className="fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-end gap-2 md:hidden"
      >
        <div
          className={`flex flex-col items-end gap-2 transition-all duration-300 ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          {socialLinks.map((s) => {
            const Icon = iconMap[s.icon];
            const color = colorMap[s.icon];
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
                onClick={() => setOpen(false)}
                className={`flex size-11 items-center justify-center rounded-full text-white shadow-[0_8px_18px_-8px_rgba(0,0,0,0.55)] ${color}`}
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close social links" : "Open social links"}
          aria-expanded={open}
          className="flex size-12 items-center justify-center rounded-full bg-emerald-700 text-white shadow-[0_8px_18px_-8px_rgba(0,0,0,0.55)] transition-transform duration-200 active:scale-95"
        >
          {open ? (
            <X className="size-5" strokeWidth={1.75} />
          ) : (
            <Share2 className="size-5" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </>
  );
}
