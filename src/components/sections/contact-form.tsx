"use client";

import * as React from "react";
import { Send, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/config";

const projectTypes = [
  "Commercial",
  "Industrial",
  "Government",
  "Multifamily",
  "Renovation",
  "Landscape",
  "Other",
];

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Static for now. Once the Laravel API is live, replace this with:
    //
    // await fetch(`${API_URL}/contact`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    // });
    void API_URL;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="corner-brackets flex flex-col items-start gap-3 bg-sky-50 p-8">
        <CheckCircle2 className="size-8 text-blue-600" />
        <h3 className="font-display text-2xl font-semibold tracking-wide text-blue-900">
          Message received
        </h3>
        <p className="text-[14px] leading-relaxed text-steel">
          Thanks for reaching out — a member of our estimating team will follow up within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Jordan Miller" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Miller Development Group" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="jordan@company.com" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="(800) 555-0142" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="projectType">Project type</Label>
        <select
          id="projectType"
          name="projectType"
          className="h-11 w-full border border-blue-100 bg-white px-3.5 text-sm text-ink focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
          defaultValue=""
        >
          <option value="" disabled>
            Select a project type
          </option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Project details</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about scope, location, and timeline..."
          required
        />
      </div>

      <Button type="submit" size="lg">
        Send message <Send className="size-4" />
      </Button>
    </form>
  );
}
