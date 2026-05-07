"use client";

import { useState } from "react";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-6 bg-gold/5 rounded-xl border border-gold/10"
      >
        <p className="text-sm text-gold font-display italic">Danke für deine Resonanz.</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <p className="text-[10px] font-mono text-gold/60 uppercase tracking-widest px-1">Bewertung</p>
        <div className="grid grid-cols-3 gap-3">
          {(["positiv", "teilweise", "negativ"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className={cn(
                "px-3 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all border",
                rating === r
                  ? "bg-gold/20 text-gold border-gold/40 shadow-[0_0_15px_rgba(200,164,93,0.1)]"
                  : "bg-bg/40 text-text-muted border-gold/5 hover:border-gold/20"
              )}
            >
              {r === "positiv" ? "Präzise" : r === "teilweise" ? "Teils" : "Unklar"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-mono text-gold/60 uppercase tracking-widest px-1">Nuancen</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => toggleTag(tag.value)}
              className={cn(
                "text-[9px] font-mono px-3 py-1.5 rounded-full transition-all border",
                selectedTags.includes(tag.value)
                  ? "bg-violet-deep/40 text-violet border-violet/40 shadow-[0_0_10px_rgba(124,92,255,0.1)]"
                  : "bg-surface-raised/40 text-text-muted border-gold/5 hover:border-gold/20"
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-mono text-gold/60 uppercase tracking-widest px-1">Anmerkung (Optional)</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Wie hat dich die Deutung berührt?"
          rows={3}
          className="w-full bg-bg/50 border border-gold/10 rounded-2xl px-5 py-4 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-gold/30 transition-all resize-none shadow-inner"
        />
      </div>

      {error && <p className="text-xs text-danger-muted font-mono">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={!rating || submitting}
        variant="secondary"
        className="w-full sm:w-auto"
      >
        {submitting ? "Übertragung..." : "Feedback senden"}
      </Button>
    </div>
  );
}
