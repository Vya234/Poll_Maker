import React from "react";
import { cn } from "../lib/cn";
import Button from "./Button";

function getTotalVotes(poll) {
  if (!poll?.options?.length) return 0;
  return poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
}

function getCreatorLabel(poll) {
  const creator = poll?.createdBy;
  if (!creator) return null;
  if (typeof creator === "object" && creator.username) {
    return creator.username;
  }
  return null;
}

function formatPollTypeLabel(pollType) {
  if (pollType === "Single Choice") return "Single choice";
  if (pollType === "Multiple Choice") return "Multiple choice";
  return pollType || "Poll";
}

const PollCard = ({ poll, onVote }) => {
  const totalVotes = getTotalVotes(poll);
  const creator = getCreatorLabel(poll);
  const typeLabel = formatPollTypeLabel(poll.pollType);
  const isSingle = poll.pollType === "Single Choice";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-brand-500/15 bg-white p-5 shadow-card",
        "transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg",
      )}
    >
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="text-lg font-bold leading-snug tracking-tight text-ink">{poll.title}</h3>
        <div className="flex flex-wrap items-center gap-2 gap-x-3">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
              isSingle ? "bg-brand-100 text-brand-800" : "bg-brand-50 text-brand-800 ring-1 ring-brand-200",
            )}
          >
            {typeLabel}
          </span>
          <span className="inline-flex items-baseline gap-1.5 text-sm text-ink-muted">
            <span className="font-bold tabular-nums text-brand-600">{totalVotes}</span>
            <span className="font-medium">total votes</span>
          </span>
          {creator ? (
            <span className="w-full text-sm text-ink-muted sm:w-auto">
              <span className="font-semibold text-brand-500/80">By</span> {creator}
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-4 border-t border-brand-500/10 pt-4">
        <Button
          variant="primary"
          onClick={onVote}
          className="w-full shadow-md shadow-brand-900/10"
          aria-label={`Vote on poll: ${poll.title}`}
        >
          Vote
        </Button>
      </div>
    </article>
  );
};

export default PollCard;
