"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

export const journeyAccessKey = "yihung-journey-unlocked";

type JourneyAccessDialogProps = {
  open: boolean;
  onClose?: () => void;
  onSuccess: () => void;
};

export function JourneyAccessDialog({ open, onClose, onSuccess }: JourneyAccessDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password === "123") {
      window.sessionStorage.setItem(journeyAccessKey, "true");
      setError(false);
      onSuccess();
      return;
    }

    setError(true);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="journey-access-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose?.();
          }}
        >
          <motion.div
            className="journey-access-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="journey-access-title"
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="journey-access-eyebrow">Private page</p>
            <h2 id="journey-access-title">Enter password</h2>
            <form onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="journey-password">Password</label>
              <input
                id="journey-password"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                autoFocus
                value={password}
                aria-invalid={error}
                aria-describedby={error ? "journey-password-error" : undefined}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError(false);
                }}
                placeholder="Password"
              />
              <button type="submit">View Journey</button>
            </form>
            <p
              id="journey-password-error"
              className={`journey-access-error ${error ? "is-visible" : ""}`}
              aria-live="polite"
            >
              Incorrect password. Please try again.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
