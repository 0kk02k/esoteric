"use client";

import { useState } from "react";
import { Button } from "./Button";
import { motion } from "framer-motion";
import { api, ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type FeedbackFormProps = {
  readingId: string;
  onSubmit?: () => void;
};

const TAGS = [
  { value: "hilfreich", label: "Hilfreich" },
  { value: "zu_allgemein", label: "Zu allgemein" },
  { value: "zu_intensiv", label: "Zu intensiv" },
  { value: "unpassend", label: "Unpassend" },
  { value: "mehr_astrologie", label: "Mehr Astrologie" },
  { value: "mehr_tarot", label: "Mehr Tarot" },
];

const RATINGS = [
  { value: "positiv", label: "Ja" },
  { value: "teilweise", label: "Teilweise" },
  { value: "negativ", label: "Nein" },
] as const;

export default function FeedbackForm({ readingId, onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState<"positiv" | "teilweise" | "negativ" | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    setError(null);

    try {
      await api(`/api/readings/${readingId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, tags: selectedTags, comment: comment || undefined }),
      });
      setSubmitted(true);
      onSubmit?.();
    } catch (err) {
      // Netzfehler sprechen für sich; alles andere bekommt Feedback-Kontext
      setError(
        err instanceof ApiError && err.status === 0
          ? err.message
          : "Deine Resonanz konnte nicht gesendet werden. Bitte versuche es erneut.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="status"
        className="text-center py-6 bg-gold/5 rounded-xl border border-gold/10"
      >
        <p className="text-sm text-gold font-display">Danke für deine Resonanz.</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <fieldset className="space-y-4">
        <legend className="text-sm text-text-secondary mb-4">Hat diese Deutung resoniert?</legend>
        <div className="grid grid-cols-3 gap-3">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRating(r.value)}
              aria-pressed={rating === r.value}
              className={cn(
                "px-3 py-3.5 rounded-xl text-sm transition-all border",
                rating === r.value
                  ? "bg-gold/20 text-gold border-gold/40 shadow-[0_0_15px_rgba(200,164,93,0.1)]"
                  : "bg-bg/40 text-text-secondary border-gold/10 hover:border-gold/25 hover:text-text"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-[11px] font-mono text-gold/80 uppercase tracking-widest px-1 mb-4">
          Nuancen (optional)
        </legend>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => toggleTag(tag.value)}
              aria-pressed={selectedTags.includes(tag.value)}
              className={cn(
                "min-h-[44px] px-4 py-2 rounded-full text-[11px] inline-flex items-center transition-all border",
                selectedTags.includes(tag.value)
                  ? "bg-violet-deep/40 text-violet-soft border-violet/40 shadow-[0_0_10px_rgba(124,92,255,0.1)]"
                  : "bg-surface-raised/40 text-text-secondary border-gold/10 hover:border-gold/25"
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-4">
        <label
          htmlFor="feedback-comment"
          className="block text-[11px] font-mono text-gold/80 uppercase tracking-widest px-1"
        >
          Anmerkung (optional)
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Wie hat dich die Deutung berührt?"
          rows={3}
          maxLength={1000}
          className="w-full glass-input rounded-2xl px-5 py-4 text-base text-text resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-danger-muted" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={!rating || submitting} variant="secondary" className="w-full sm:w-auto">
        {submitting ? "Übertragung..." : "Feedback senden"}
      </Button>
    </form>
  );
}
