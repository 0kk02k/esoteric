"use client";

import { useState } from "react";
import Button from "./Button";

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
      const res = await fetch(`/api/readings/${readingId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, tags: selectedTags, comment: comment || undefined }),
      });
      if (!res.ok) throw new Error(`Feedback error: ${res.status}`);
      setSubmitted(true);
      onSubmit?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Feedback fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-success-muted">Danke für dein Feedback!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-secondary">Wie hat dir diese Deutung gefallen?</p>

      <div className="flex gap-3">
        {(["positiv", "teilweise", "negativ"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRating(r)}
            className={`px-4 py-2 rounded-[var(--radius-input)] text-sm font-medium transition-all ${
              rating === r
                ? "bg-gold text-background"
                : "bg-surface-raised text-text-secondary hover:border-gold border border-transparent"
            }`}
          >
            {r === "positiv" ? "Gut" : r === "teilweise" ? "Teilweise" : "Nicht hilfreich"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag.value}
            type="button"
            onClick={() => toggleTag(tag.value)}
            className={`text-xs font-mono px-3 py-1 rounded-full transition-all ${
              selectedTags.includes(tag.value)
                ? "bg-violet-deep text-violet border border-violet/30"
                : "bg-surface-raised text-text-muted border border-transparent hover:border-border"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional: Was hat dir gefehlt oder besonders geholfen?"
        rows={2}
        className="w-full bg-surface-raised border border-border rounded-[var(--radius-input)] px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50 resize-none"
      />

      {error && <p className="text-xs text-danger-muted">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={!rating || submitting}
        variant="secondary"
        className="self-start"
      >
        {submitting ? "Wird gesendet..." : "Feedback senden"}
      </Button>
    </div>
  );
}
